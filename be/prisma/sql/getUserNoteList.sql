-- @param {String} $1:userId The id of user that created the note
-- @param {Int} $2:offset
-- @param {Int} $3:limit
-- @param {Boolean} $4:pinned
-- @param {Boolean} $5:isDeleted
SELECT 
    id,
    title,
    CASE 
        WHEN LENGTH(content) > 100 
        THEN LEFT(content, 100) || '...'
        ELSE "content"
    END AS "content",
    "createdAt",
    "updatedAt",
    "pinned"
FROM "Note" n
WHERE "userId" = $1 AND "isDeleted"=$5 AND "pinned"=$4
ORDER BY "updatedAt" DESC
OFFSET $2
LIMIT $3;