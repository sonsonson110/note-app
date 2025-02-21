-- @param {String} $1:userId The id of user that created the note
-- @param {Int} $2:offset
-- @param {Int} $3:limit
SELECT 
    id,
    title,
    CASE 
        WHEN LENGTH(content) > 100 
        THEN LEFT(content, 100) || '...'
        ELSE "content"
    END AS "content",
    "createdAt",
    "updatedAt"
FROM "Note" n
WHERE "userId" = $1
ORDER BY "updatedAt" DESC
OFFSET $2
LIMIT $3;