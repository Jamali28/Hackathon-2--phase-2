#!/bin/bash

# Consolidated prerequisite checking script (Bash)
#
# This script provides unified prerequisite checking for Spec-Driven Development workflow.
# It mirrors the functionality of the PowerShell version.
#
# Usage: ./check-prerequisites.sh [OPTIONS]
#
# OPTIONS:
#   --json               Output in JSON format
#   --require-tasks      Require tasks.md to exist (for implementation phase)
#   --include-tasks      Include tasks.md in AVAILABLE_DOCS list
#   --paths-only         Only output path variables (no validation)
#   --help, -h           Show help message

set -euo pipefail

JSON_OUTPUT=false
REQUIRE_TASKS=false
INCLUDE_TASKS=false
PATHS_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --require-tasks)
            REQUIRE_TASKS=true
            shift
            ;;
        --include-tasks)
            INCLUDE_TASKS=true
            shift
            ;;
        --paths-only)
            PATHS_ONLY=true
            shift
            ;;
        -h|--help)
            cat << 'EOF'
Usage: check-prerequisites.sh [OPTIONS]

Consolidated prerequisite checking for Spec-Driven Development workflow.

OPTIONS:
  --json               Output in JSON format
  --require-tasks      Require tasks.md to exist (for implementation phase)
  --include-tasks      Include tasks.md in AVAILABLE_DOCS list
  --paths-only         Only output path variables (no validation)
  --help, -h           Show this help message

EXAMPLES:
  # Check task prerequisites (plan.md required)
  ./check-prerequisites.sh --json

  # Check implementation prerequisites (plan.md + tasks.md required)
  ./check-prerequisites.sh --json --require-tasks --include-tasks

  # Get feature paths only (no validation)
  ./check-prerequisites.sh --paths-only
EOF
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

# Source common functions if they exist
if [ -f "$(dirname "$0")/common.sh" ]; then
    . "$(dirname "$0")/common.sh"
else
    # Define basic functions if common.sh doesn't exist
    get_repo_root() {
        if command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1; then
            git rev-parse --show-toplevel
        else
            # Fallback to script location for non-git repos
            dirname "$(dirname "$(dirname "$(realpath "$0")")")"
        fi
    }

    get_current_branch() {
        # Check if SPECIFY_FEATURE environment variable is set
        if [ -n "${SPECIFY_FEATURE:-}" ]; then
            echo "$SPECIFY_FEATURE"
        elif command -v git >/dev/null 2>&1 && git rev-parse --abbrev-ref HEAD >/dev/null 2>&1; then
            git rev-parse --abbrev-ref HEAD
        else
            # For non-git repos, try to find the latest feature directory
            local repo_root
            repo_root=$(get_repo_root)
            local specs_dir="$repo_root/specs"

            if [ -d "$specs_dir" ]; then
                local latest_feature=""
                local highest=0

                for dir in "$specs_dir"/*/; do
                    if [ -d "$dir" ]; then
                        dir_name=$(basename "$dir")
                        if [[ $dir_name =~ ^([0-9]{3})- ]]; then
                            num=${BASH_REMATCH[1]}
                            if [ "$num" -gt "$highest" ]; then
                                highest=$num
                                latest_feature=$dir_name
                            fi
                        fi
                    fi
                done

                if [ -n "$latest_feature" ]; then
                    echo "$latest_feature"
                    return
                fi
            fi

            # Final fallback
            echo "main"
        fi
    }

    test_has_git() {
        command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1
    }

    test_feature_branch() {
        local branch=$1
        local has_git=${2:-$(test_has_git)}

        # For non-git repos, we can't enforce branch naming but still provide output
        if [ "$has_git" != true ] && [ "$has_git" != "true" ]; then
            echo "[specify] Warning: Git repository not detected; skipped branch validation" >&2
            return 0
        fi

        if [[ ! $branch =~ ^[0-9]{3}- ]]; then
            echo "ERROR: Not on a feature branch. Current branch: $branch" >&2
            echo "Feature branches should be named like: 001-feature-name" >&2
            return 1
        fi
        return 0
    }

    get_feature_dir() {
        local repo_root=$1
        local branch=$2
        echo "$repo_root/specs/$branch"
    }

    get_feature_paths_env() {
        local repo_root
        repo_root=$(get_repo_root)
        local current_branch
        current_branch=$(get_current_branch)
        local has_git
        has_git=$(test_has_git && echo "true" || echo "false")
        local feature_dir
        feature_dir=$(get_feature_dir "$repo_root" "$current_branch")

        # Export variables for use
        export REPO_ROOT="$repo_root"
        export CURRENT_BRANCH="$current_branch"
        export HAS_GIT="$has_git"
        export FEATURE_DIR="$feature_dir"
        export FEATURE_SPEC="$feature_dir/spec.md"
        export IMPL_PLAN="$feature_dir/plan.md"
        export TASKS="$feature_dir/tasks.md"
        export RESEARCH="$feature_dir/research.md"
        export DATA_MODEL="$feature_dir/data-model.md"
        export QUICKSTART="$feature_dir/quickstart.md"
        export CONTRACTS_DIR="$feature_dir/contracts"
    }
fi

# Get feature paths and validate branch
get_feature_paths_env

if ! test_feature_branch "$CURRENT_BRANCH" "$HAS_GIT"; then
    exit 1
fi

# If paths-only mode, output paths and exit (support combined --json --paths-only)
if [ "$PATHS_ONLY" = true ]; then
    if [ "$JSON_OUTPUT" = true ]; then
        cat << EOF
{"REPO_ROOT":"$REPO_ROOT","BRANCH":"$CURRENT_BRANCH","FEATURE_DIR":"$FEATURE_DIR","FEATURE_SPEC":"$FEATURE_SPEC","IMPL_PLAN":"$IMPL_PLAN","TASKS":"$TASKS"}
EOF
    else
        echo "REPO_ROOT: $REPO_ROOT"
        echo "BRANCH: $CURRENT_BRANCH"
        echo "FEATURE_DIR: $FEATURE_DIR"
        echo "FEATURE_SPEC: $FEATURE_SPEC"
        echo "IMPL_PLAN: $IMPL_PLAN"
        echo "TASKS: $TASKS"
    fi
    exit 0
fi

# Validate required directories and files
if [ ! -d "$FEATURE_DIR" ]; then
    echo "ERROR: Feature directory not found: $FEATURE_DIR"
    echo "Run /sp.specify first to create the feature structure."
    exit 1
fi

if [ ! -f "$IMPL_PLAN" ]; then
    echo "ERROR: plan.md not found in $FEATURE_DIR"
    echo "Run /sp.plan first to create the implementation plan."
    exit 1
fi

# Check for tasks.md if required
if [ "$REQUIRE_TASKS" = true ] && [ ! -f "$TASKS" ]; then
    echo "ERROR: tasks.md not found in $FEATURE_DIR"
    echo "Run /sp.tasks first to create the task list."
    exit 1
fi

# Build list of available documents
docs=()

# Always check these optional docs
if [ -f "$RESEARCH" ]; then docs+=("research.md"); fi
if [ -f "$DATA_MODEL" ]; then docs+=("data-model.md"); fi

# Check contracts directory (only if it exists and has files)
if [ -d "$CONTRACTS_DIR" ] && [ -n "$(ls -A "$CONTRACTS_DIR" 2>/dev/null)" ]; then
    docs+=("contracts/")
fi

if [ -f "$QUICKSTART" ]; then docs+=("quickstart.md"); fi

# Include tasks.md if requested and it exists
if [ "$INCLUDE_TASKS" = true ] && [ -f "$TASKS" ]; then
    docs+=("tasks.md")
fi

# Output results
if [ "$JSON_OUTPUT" = true ]; then
    # Build JSON array
    json_docs="["
    for i in "${!docs[@]}"; do
        if [ $i -gt 0 ]; then
            json_docs="$json_docs,"
        fi
        json_docs="$json_docs\"${docs[$i]}\""
    done
    json_docs="$json_docs]"

    cat << EOF
{"FEATURE_DIR":"$FEATURE_DIR","AVAILABLE_DOCS":$json_docs}
EOF
else
    echo "FEATURE_DIR:$FEATURE_DIR"
    echo "AVAILABLE_DOCS:"

    # Show status of each potential document
    for doc in "research.md" "data-model.md" "quickstart.md"; do
        doc_path="$FEATURE_DIR/$doc"
        if [ -f "$doc_path" ]; then
            echo "  ✓ $doc"
        else
            echo "  ✗ $doc"
        fi
    done

    if [ -d "$CONTRACTS_DIR" ] && [ -n "$(ls -A "$CONTRACTS_DIR" 2>/dev/null)" ]; then
        echo "  ✓ contracts/"
    else
        echo "  ✗ contracts/"
    fi

    if [ "$INCLUDE_TASKS" = true ]; then
        if [ -f "$TASKS" ]; then
            echo "  ✓ tasks.md"
        else
            echo "  ✗ tasks.md"
        fi
    fi
fi