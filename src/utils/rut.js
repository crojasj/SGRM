export function validarRut(rut) {
  if (!rut) return false;
  
  let rutLimpio = rut
    .replace(/\./g, '')
    .replace(/-/g, '');

  if (rutLimpio.length < 8) return false;

  let cuerpo = rutLimpio.slice(0, -1);
  let dv = rutLimpio.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);

  const dvCalculado =
    dvEsperado === 11
      ? '0'
      : dvEsperado === 10
      ? 'K'
      : dvEsperado.toString();

  return dv === dvCalculado;
}
