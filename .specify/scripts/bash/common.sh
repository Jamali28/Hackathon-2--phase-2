#!/bin/bash

# Common bash functions for Spec-Driven Development workflow

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

test_file_exists() {
    local path=$1
    local description=$2

    if [ -f "$path" ]; then
        echo "  ✓ $description"
        return 0
    else
        echo "  ✗ $description"
        return 1
    fi
}

test_dir_has_files() {
    local path=$1
    local description=$2

    if [ -d "$path" ] && [ -n "$(ls -A "$path" 2>/dev/null)" ]; then
        echo "  ✓ $description"
        return 0
    else
        echo "  ✗ $description"
        return 1
    fi
}