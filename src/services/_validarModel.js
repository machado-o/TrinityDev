async function validarModel(instance) {
  try {
    await instance.validate();
    return [];
  } catch (e) {
    return e.errors
      .filter(err => !err.path.endsWith('Id'))
      .map(err => err.message);
  }
}

export { validarModel };
