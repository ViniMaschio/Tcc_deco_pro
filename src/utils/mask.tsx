export const formatCEPCodeNumber = (value: string | undefined) => {
  if (!value) return "";
  if (value.length > 9) return value.substring(0, 9);
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d{3})+?$/, "$1-$2")
    .replace(/(-\d{3})(\d+?)/, "$1");
};

export const formatPhoneNumber = (value: string | undefined) => {
  if (!value) return "";
  if (value.length > 15) return value.substring(0, 15);
  return value
    .replace(/\D/g, "")
    .replace(
      /(?:(^\+\d{2})?)(?:([1-9]{2})|([0-9]{3})?)(\d{4,5})(\d{4})/,
      (_fullMatch, country, ddd, dddWithZero, prefixTel, suffixTel) => {
        if (country)
          return `${country} (${ddd || dddWithZero}) ${prefixTel}-${suffixTel}`;
        if (ddd || dddWithZero)
          return `(${ddd || dddWithZero}) ${prefixTel}-${suffixTel}`;
        if (prefixTel && suffixTel) return `${prefixTel}-${suffixTel}`;
        return value;
      },
    );
};

export const formatCPFNumber = (value: string | undefined) => {
  if (!value) return "";
  if (value.length > 14) return value.substring(0, 14);
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatCNPJNumber = (value: string | undefined) => {
  if (!value) return "";
  if (value.length > 18) return value.substring(0, 18);
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};