import { ApiError } from '../types/apiError'

export interface HttpErrorHandlerProps {
  statusCode: number
  errorObject: ApiError
  errorKeys?: string[]
  setFieldErrors?: { [key: string]: (error: string) => void }
  context?: { setIsAuthenticated: (value: boolean) => void }
}

export const httpErrorHandler = ({
  statusCode,
  errorObject,
  errorKeys,
  setFieldErrors,
  context,
}: HttpErrorHandlerProps): void => {
  interface ErrorCases {
    [key: number]: () => void
    default: () => void
  }

  const errorCases: ErrorCases = {
    400: () => {
      handleBadRequest(errorObject, errorKeys, setFieldErrors)
    },
    401: () => handleUnauthorized(context),
    404: () =>
      console.log({
        title: 'Not Found',
        message: 'Requested resource not found'
      }),
    500: () =>
      console.log({
        title: 'Server Error',
        message: 'Internal Server Error'
      }),
    default: () =>
      console.log({
        title: 'Error',
        message: 'Something went wrong'
      })
  }

  const handleCustomError = errorCases[statusCode] || errorCases.default
  handleCustomError()
}

const handleBadRequest = (
  errorObject: ApiError,
  errorKeys?: string[],
  setFieldErrors?: { [key: string]: (error: string) => void }
) => {
  if (!errorObject?.error?.details || !setFieldErrors) return

  errorObject.error.details.forEach((detail) => {
    const fieldName = detail.property
    if (errorKeys?.includes(fieldName) && detail.constraints) {
      // Get the first constraint message
      const errorMessage = Object.values(detail.constraints)[0]
      setFieldErrors[fieldName](errorMessage)
    }
  })
}

const handleUnauthorized = (context?: { setIsAuthenticated: (value: boolean) => void }) => {
  // Show an error toast to notify the user about token expiration
  // Clear any stored authentication data
  localStorage.removeItem('token')
  // Update the authentication state in the context
  context?.setIsAuthenticated(false)
  // Navigate user to login page
  window.location.href = '/login'
}
