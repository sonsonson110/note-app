-- @param {String} $1:userId The id of user that created the note
-- @param {Int} $2:offset
-- @param {Int} $3:limit
-- @param {Boolean} $4:pinned
-- @param {Boolean} $5:isDeleted
-- @param {String} $6:searchKeyword Filter with title and any tag from note that contain the keyword
SELECT 
    id,
    CASE 
        WHEN LENGTH(content) > 100 
        THEN LEFT(content, 100) || '...'
        ELSE "content"
    END AS "content",
    "createdAt",
    "updatedAt",
    "pinned",
    "title"
FROM "Note" n
WHERE "userId" = $1 
    AND "isDeleted"=$5 
    AND "pinned"=$4
    AND ($6 = '' OR "title" LIKE '%' || $6 || '%')
ORDER BY "updatedAt" DESC
OFFSET $2
LIMIT $3;