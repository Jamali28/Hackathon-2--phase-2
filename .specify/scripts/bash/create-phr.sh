#!/bin/bash

# Create a Prompt History Record (PHR) - Bash version
# This script creates a PHR based on the template and user input

set -euo pipefail

# Default values
TITLE=""
STAGE=""
FEATURE=""
JSON_OUTPUT=false

# Parse command line options
while [[ $# -gt 0 ]]; do
    case $1 in
        --title)
            TITLE="$2"
            shift 2
            ;;
        --stage)
            STAGE="$2"
            shift 2
            ;;
        --feature)
            FEATURE="$2"
            shift 2
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

# Validate required parameters
if [ -z "$TITLE" ] || [ -z "$STAGE" ]; then
    echo "Usage: $0 --title <title> --stage <stage> [--feature <feature>] [--json]" >&2
    exit 1
fi

# Determine the route based on stage
case "$STAGE" in
    constitution)
        ROUTE="history/prompts/constitution"
        ;;
    spec|plan|tasks|red|green|refactor|explainer|misc)
        if [ -n "$FEATURE" ]; then
            ROUTE="history/prompts/$FEATURE"
        else
            # Try to detect feature from branch
            if command -v git >/dev/null 2>&1 && git rev-parse --abbrev-ref HEAD >/dev/null 2>&1; then
                CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
                if [[ $CURRENT_BRANCH =~ ^[0-9]{3}- ]]; then
                    ROUTE="history/prompts/$CURRENT_BRANCH"
                else
                    ROUTE="history/prompts/general"
                fi
            else
                ROUTE="history/prompts/general"
            fi
        fi
        ;;
    *)
        ROUTE="history/prompts/general"
        ;;
esac

# Create the directory if it doesn't exist
mkdir -p "$ROUTE"

# Find the next available ID by looking for the highest numbered file
MAX_ID=0
for file in "$ROUTE"/*-*."$STAGE".prompt.md; do
    if [ -f "$file" ]; then
        FILENAME=$(basename "$file")
        ID_PART=${FILENAME%%-*}
        if [[ $ID_PART =~ ^[0-9]+$ ]] && [ "$ID_PART" -gt "$MAX_ID" ]; then
            MAX_ID=$ID_PART
        fi
    fi
done
NEW_ID=$((MAX_ID + 1))

# Create the slug from title
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

# Create the filename
if [ "$STAGE" = "constitution" ]; then
    FILENAME="$NEW_ID-$SLUG.constitution.prompt.md"
elif [ "$STAGE" = "general" ]; then
    FILENAME="$NEW_ID-$SLUG.general.prompt.md"
else
    FILENAME="$NEW_ID-$SLUG.$STAGE.prompt.md"
fi

OUTPUT_PATH="$ROUTE/$FILENAME"

# Get the PHR template
TEMPLATE_FILE=".specify/templates/phr-template.prompt.md"
if [ ! -f "$TEMPLATE_FILE" ]; then
    TEMPLATE_FILE="templates/phr-template.prompt.md"
    if [ ! -f "$TEMPLATE_FILE" ]; then
        # Create a basic template if none exists
        cat > "$TEMPLATE_FILE" << 'EOF'
---
id: {{ID}}
title: {{TITLE}}
stage: {{STAGE}}
date_iso: {{DATE_ISO}}
surface: agent
model: {{MODEL}}
feature: {{FEATURE}}
branch: {{BRANCH}}
user: {{USER}}
command: {{COMMAND}}
labels: {{LABELS}}
links:
  spec: {{LINKS_SPEC}}
  ticket: {{LINKS_TICKET}}
  adr: {{LINKS_ADR}}
  pr: {{LINKS_PR}}
files: {{FILES_YAML}}
tests: {{TESTS_YAML}}
---

## Prompt

{{PROMPT_TEXT}}

## Response

{{RESPONSE_TEXT}}

## Outcome

{{OUTCOME}}

## Evaluation

{{EVALUATION}}
EOF
    fi
fi

# Read the template
TEMPLATE=$(cat "$TEMPLATE_FILE")

# Replace placeholders in the template
DATE_ISO=$(date -I)
MODEL="${MODEL:-$(echo $ANTHROPIC_MODEL 2>/dev/null || echo "unknown")}"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
USER=$(git config user.name 2>/dev/null || echo "unknown")
COMMAND="${COMMAND:-$0}"

# Fill in the template
OUTPUT=$(echo "$TEMPLATE" | \
    sed "s/{{ID}}/$NEW_ID/g" | \
    sed "s/{{TITLE}}/$TITLE/g" | \
    sed "s/{{STAGE}}/$STAGE/g" | \
    sed "s/{{DATE_ISO}}/$DATE_ISO/g" | \
    sed "s/{{MODEL}}/$MODEL/g" | \
    sed "s/{{FEATURE}}/$FEATURE/g" | \
    sed "s/{{BRANCH}}/$BRANCH/g" | \
    sed "s/{{USER}}/$USER/g" | \
    sed "s/{{COMMAND}}/$COMMAND/g" | \
    sed "s/{{LABELS}}/\[\]/g" | \
    sed "s/{{LINKS_SPEC}}/null/g" | \
    sed "s/{{LINKS_TICKET}}/null/g" | \
    sed "s/{{LINKS_ADR}}/null/g" | \
    sed "s/{{LINKS_PR}}/null/g" | \
    sed "s/{{FILES_YAML}}/\[\]/g" | \
    sed "s/{{TESTS_YAML}}/\[\]/g" | \
    sed "s/{{PROMPT_TEXT}}/No prompt text provided/g" | \
    sed "s/{{RESPONSE_TEXT}}/No response text provided/g" | \
    sed "s/{{OUTCOME}}/Not specified/g" | \
    sed "s/{{EVALUATION}}/Not evaluated/g")

# Write the output file
echo "$OUTPUT" > "$OUTPUT_PATH"

if [ "$JSON_OUTPUT" = true ]; then
    cat << EOF
{"id": $NEW_ID, "path": "$OUTPUT_PATH", "stage": "$STAGE", "title": "$TITLE"}
EOF
else
    echo "Created PHR: $OUTPUT_PATH"
fi