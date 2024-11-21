export async function createExperience(prevState: State, formData: FormData): Promise<State> {
  try {
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string

    // Validate date format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}$/.test(endDate)) {
      return {
        message: null,
        errors: {
          form: ['Invalid date format. Use YYYY-MM format.']
        }
      }
    }

    const data: ExperienceFormData = {
      company: formData.get('company') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate,
      endDate,
    }
    
    await db.insert(jobExperiences).values(data)
    return { message: 'Experience created successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateExperience(prevState: State, formData: FormData): Promise<State> {
  try {
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const id = formData.get('id') as string

    // Validate date format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}$/.test(endDate)) {
      return {
        message: null,
        errors: {
          form: ['Invalid date format. Use YYYY-MM format.']
        }
      }
    }

    const data: ExperienceFormData = {
      company: formData.get('company') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate,
      endDate,
    }

    await db
      .update(jobExperiences)
      .set(data)
      .where(eq(jobExperiences.id, id))

    return { message: 'Experience updated successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
} 