#!/bin/sh
# ==============================================================================
# Enterprise Automated Database Backup Script (PostgreSQL 16)
# Alpha School Website Management Platform
# ==============================================================================

set -e

BACKUP_DIR="${BACKUP_DIR:-/backups}"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-school_cms_prod}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${POSTGRES_DB}_backup_${TIMESTAMP}.sql.gz"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

mkdir -p "${BACKUP_DIR}"

echo "=========================================================="
echo "🕒 [$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting Database Backup..."
echo "Target Database : ${POSTGRES_DB} @ ${POSTGRES_HOST}"
echo "Destination     : ${BACKUP_FILE}"
echo "=========================================================="

export PGPASSWORD="${POSTGRES_PASSWORD}"

# Execute pg_dump with custom compression and clean drop statements
pg_dump -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
  --format=plain \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists | gzip -9 > "${BACKUP_FILE}"

# Generate SHA-256 cryptographic checksum for compliance & audit
sha256sum "${BACKUP_FILE}" | awk '{print $1}' > "${CHECKSUM_FILE}"

BACKUP_SIZE=$(ls -lh "${BACKUP_FILE}" | awk '{print $5}')
CHECKSUM_VAL=$(cat "${CHECKSUM_FILE}")

echo "✅ Backup Completed Successfully!"
echo "   File Size : ${BACKUP_SIZE}"
echo "   SHA-256   : ${CHECKSUM_VAL}"

# Retention Cleanup: Delete backups older than RETENTION_DAYS
echo "🧹 Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f \( -name "*.sql.gz" -o -name "*.sha256" \) -mtime "+${RETENTION_DAYS}" -exec rm -f {} +
REMAINING_COUNT=$(find "${BACKUP_DIR}" -name "*.sql.gz" | wc -l)
echo "📦 Total Retained Backups: ${REMAINING_COUNT}"
echo "=========================================================="
