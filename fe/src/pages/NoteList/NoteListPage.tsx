import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { notebookApi } from '../../services/notebook/notebook'
import { httpErrorHandler } from '../../handlers/httpErrorHandler'
import { ApiError } from '../../types/apiError'

export function NoteListPage({}) {
  const { user, setIsAuthenticated } = useAuth()

  const request = () =>
    notebookApi.getUserNotebooks().catch((error) => {
      if (error.response) {
        const { status, data } = error.response
        httpErrorHandler({
          statusCode: status,
          errorObject: data as ApiError,
          context: { setIsAuthenticated }
        })
      }
    })

  useEffect(() => {
    request()
  }, [])

  return (
    <div>
      <button onClick={() => request()}>request</button>
      {(() => {
        const arr = []
        for (let i = 0; i < 100; i++) {
          arr.push(
            <div key={i}>
              <span>{i}</span>
            </div>
          )
        }
        return arr
      })()}
      <span>{JSON.stringify(user)}</span>
    </div>
  )
}
