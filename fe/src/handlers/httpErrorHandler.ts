import { Bounce, toast } from 'react-toastify'
import { ApiError } from '../types/apiError'

export interface HttpErrorHandlerProps {
  statusCode: number
  errorObject: ApiError
  errorKeys?: string[]
  setFieldErrors?: { [key: string]: (error: string) => void }
  context?: { setIsAuthenticated: (value: boolean) => void }
}

const notifyError = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'light',
    transition: Bounce
  })
}

export const httpErrorHandler = ({
  statusCode,
  errorObject,
  errorKeys,
  setFieldErrors,
  context
}: HttpErrorHandlerProps): void => {
  interface ErrorCases {
    [key: number]: () => void
    default: () => void
  }

  const errorCases: ErrorCases = {
    400: () => {
      notifyError(errorObject.error.message)
      handleBadRequest(errorObject, errorKeys, setFieldErrors)
    },
    401: () => {
      notifyError(errorObject.error.message)
      handleUnauthorized(context)
    },
    404: () => notifyError(errorObject.error.message),
    500: () => notifyError(errorObject.error.message),
    default: () => notifyError('Something went wrong')
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
  localStorage.removeItem('accessToken')
  // Update the authentication state in the context
  context?.setIsAuthenticated(false)
}
