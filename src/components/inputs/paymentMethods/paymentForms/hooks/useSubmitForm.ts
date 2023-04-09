import { useState } from 'react'

export const useSubmitForm = <T>(onSubmit: (data: T) => void) => {
  const [stepValid, setStepValid] = useState(false)
  const [formData, setFormData] = useState<T>()

  const submitForm = () => {
    if (!stepValid || !formData) return
    onSubmit(formData)
  }

  return {
    submitForm,
    stepValid,
    setStepValid,
    setFormData,
  }
}
