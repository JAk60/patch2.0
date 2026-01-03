#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}Error: Backup directory not specified${NC}"
    echo "Usage: bash restore-backup.sh <backup_directory>"
    echo ""
    echo "Available backups:"
    ls -d backup_* 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error: Backup directory '$BACKUP_DIR' not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Restoring files from: $BACKUP_DIR${NC}"
echo -e "${RED}WARNING: This will overwrite current files!${NC}"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

restored=0

for backup_file in "$BACKUP_DIR"/*.bak; do
    if [ -f "$backup_file" ]; then
        original_name=$(basename "$backup_file" .bak)
        
        # Find the original file in src
        original_file=$(find src -name "$original_name" -type f)
        
        if [ -n "$original_file" ]; then
            cp "$backup_file" "$original_file"
            echo -e "${GREEN}✓ Restored: $original_file${NC}"
            restored=$((restored + 1))
        else
            echo -e "${YELLOW}⚠ Could not find: $original_name${NC}"
        fi
    fi
done

echo ""
echo -e "${GREEN}Restored $restored files${NC}"