export interface ApiError {
    success: boolean
    error: {
      code: string
      message: string
      details?: ValidationError[]
    }
  }
  
  export interface ValidationError {
    property: string
    value: any
    constraints?: {
      [type: string]: string
    }
    children?: ValidationError[]
  }