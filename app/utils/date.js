const calculateAge = (birthDate) => {
  if (!(birthDate instanceof Date)) {
    throw new Error("Invalid date passed to calculateAge.");
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if the birthday hasn't occurred yet this year
  const isBirthdayInFuture =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (isBirthdayInFuture) {
    age--;
  }

  return age;
};

export { calculateAge };
