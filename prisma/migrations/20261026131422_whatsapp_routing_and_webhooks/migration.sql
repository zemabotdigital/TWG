-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "httpStatus" INTEGER,
    "error" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "mode" TEXT NOT NULL DEFAULT 'IN_PERSON',
    "topic" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "preferredAt" DATETIME NOT NULL,
    "altAt" DATETIME,
    "confirmedAt" DATETIME,
    "durationMin" INTEGER NOT NULL DEFAULT 30,
    "meetingLink" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT NOT NULL DEFAULT '',
    "routeKey" TEXT NOT NULL DEFAULT 'maharaj_appointment',
    "sourcePage" TEXT NOT NULL DEFAULT '',
    "webhookStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "webhookAttempts" INTEGER NOT NULL DEFAULT 0,
    "webhookLastError" TEXT NOT NULL DEFAULT '',
    "webhookSentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Appointment" ("adminNote", "altAt", "city", "confirmedAt", "createdAt", "durationMin", "email", "id", "meetingLink", "message", "mode", "name", "phone", "preferredAt", "reference", "status", "topic", "updatedAt") SELECT "adminNote", "altAt", "city", "confirmedAt", "createdAt", "durationMin", "email", "id", "meetingLink", "message", "mode", "name", "phone", "preferredAt", "reference", "status", "topic", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE UNIQUE INDEX "Appointment_reference_key" ON "Appointment"("reference");
CREATE INDEX "Appointment_preferredAt_idx" ON "Appointment"("preferredAt");
CREATE INDEX "Appointment_webhookStatus_idx" ON "Appointment"("webhookStatus");
CREATE INDEX "Appointment_status_createdAt_idx" ON "Appointment"("status", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "WebhookDelivery_requestId_idx" ON "WebhookDelivery"("requestId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_createdAt_idx" ON "WebhookDelivery"("status", "createdAt");
