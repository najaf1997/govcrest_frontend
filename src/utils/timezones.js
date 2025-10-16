// Timezone choices for the application
// These correspond to the backend timezone options

export const TIMEZONE_CHOICES = [
  {
    value: "America/Adak",
    label: "HST - Hawaii-Aleutian Standard Time (America/Adak)",
  },
  {
    value: "America/Anchorage",
    label: "AKST - Alaska Standard Time (America/Anchorage)",
  },
  {
    value: "America/Anguilla",
    label: "AST - Atlantic Standard Time (America/Anguilla)",
  },
  {
    value: "America/Sao_Paulo",
    label: "BRT - Brasilia Time (America/Sao_Paulo)",
  },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "ART - Argentina Time (America/Argentina/Buenos_Aires)",
  },
  {
    value: "America/Asuncion",
    label: "PYT - Paraguay Time (America/Asuncion)",
  },
  {
    value: "America/New_York",
    label: "EST - Eastern Standard Time (America/New_York)",
  },
  {
    value: "America/Chicago",
    label: "CST - Central Standard Time (America/Chicago)",
  },
  {
    value: "America/Porto_Velho",
    label: "AMT - Amazon Time (America/Porto_Velho)",
  },
  { value: "America/Bogota", label: "COT - Colombia Time (America/Bogota)" },
  {
    value: "America/Denver",
    label: "MST - Mountain Standard Time (America/Denver)",
  },
  {
    value: "America/Caracas",
    label: "VET - Venezuelan Time (America/Caracas)",
  },
  {
    value: "America/Cayenne",
    label: "GFT - French Guiana Time (America/Cayenne)",
  },
  {
    value: "America/Danmarkshavn",
    label: "UTC - Coordinated Universal Time (America/Danmarkshavn)",
  },
  {
    value: "America/Los_Angeles",
    label: "PST - Pacific Standard Time (America/Los_Angeles)",
  },
  {
    value: "America/Rio_Branco",
    label: "ACT - Acre Time (America/Rio_Branco)",
  },
  {
    value: "America/Thule",
    label: "WGT - West Greenland Time (America/Thule)",
  },
  {
    value: "America/Guayaquil",
    label: "ECT - Ecuador Time (America/Guayaquil)",
  },
  { value: "America/Guyana", label: "GYT - Guyana Time (America/Guyana)" },
  { value: "America/La_Paz", label: "BOT - Bolivia Time (America/La_Paz)" },
  { value: "America/Lima", label: "PET - Peru Time (America/Lima)" },
  {
    value: "America/Miquelon",
    label: "PMST - Pierre & Miquelon Standard Time (America/Miquelon)",
  },
  {
    value: "America/Montevideo",
    label: "UYT - Uruguay Time (America/Montevideo)",
  },
  {
    value: "America/Noronha",
    label: "FNT - Fernando de Noronha Time (America/Noronha)",
  },
  {
    value: "America/Paramaribo",
    label: "SRT - Suriname Time (America/Paramaribo)",
  },
  {
    value: "America/Santiago",
    label: "CLT - Chile Standard Time (America/Santiago)",
  },
  {
    value: "America/St_Johns",
    label: "NST - Newfoundland Standard Time (America/St_Johns)",
  },
];

// Get timezone label by value
export const getTimezoneLabel = (value) => {
  const timezone = TIMEZONE_CHOICES.find((tz) => tz.value === value);
  return timezone ? timezone.label : value;
};

// Get timezone value by label
export const getTimezoneValue = (label) => {
  const timezone = TIMEZONE_CHOICES.find((tz) => tz.label === label);
  return timezone ? timezone.value : label;
};
