/* eslint-disable max-lines */
type CountryData = {
  name: string
  dialCode: string
  phoneAreaCodes?: string[]
  highRisk: boolean
}

export const countryMap: Record<string, CountryData> = {
  AF: {
    name: 'Afghanistan',
    dialCode: '+93',
    highRisk: false,
  },
  AX: {
    name: 'Aland Islands',
    dialCode: '+358',
    highRisk: false,
  },
  AL: {
    name: 'Albania',
    dialCode: '+355',
    highRisk: false,
  },
  DZ: {
    name: 'Algeria',
    dialCode: '+213',
    highRisk: false,
  },
  AS: {
    name: 'AmericanSamoa',
    dialCode: '+1684',
    highRisk: false,
  },
  AD: {
    name: 'Andorra',
    dialCode: '+376',
    highRisk: false,
  },
  AO: {
    name: 'Angola',
    dialCode: '+244',
    highRisk: false,
  },
  AI: {
    name: 'Anguilla',
    dialCode: '+1264',
    highRisk: false,
  },
  AQ: {
    name: 'Antarctica',
    dialCode: '+672',
    highRisk: false,
  },
  AG: {
    name: 'Antigua and Barbuda',
    dialCode: '+1268',
    highRisk: false,
  },
  AR: {
    name: 'Argentina',
    dialCode: '+54',
    highRisk: false,
  },
  AM: {
    name: 'Armenia',
    dialCode: '+374',
    highRisk: false,
  },
  AW: {
    name: 'Aruba',
    dialCode: '+297',
    highRisk: false,
  },
  AU: {
    name: 'Australia',
    dialCode: '+61',
    highRisk: false,
  },
  AT: {
    name: 'Austria',
    dialCode: '+43',
    highRisk: false,
  },
  AZ: {
    name: 'Azerbaijan',
    dialCode: '+994',
    highRisk: false,
  },
  BS: {
    name: 'Bahamas',
    dialCode: '+1242',
    highRisk: false,
  },
  BH: {
    name: 'Bahrain',
    dialCode: '+973',
    highRisk: false,
  },
  BD: {
    name: 'Bangladesh',
    dialCode: '+880',
    highRisk: false,
  },
  BB: {
    name: 'Barbados',
    dialCode: '+1246',
    highRisk: false,
  },
  BY: {
    name: 'Belarus',
    dialCode: '+375',
    highRisk: false,
  },
  BE: {
    name: 'Belgium',
    dialCode: '+32',
    highRisk: false,
  },
  BZ: {
    name: 'Belize',
    dialCode: '+501',
    highRisk: false,
  },
  BJ: {
    name: 'Benin',
    dialCode: '+229',
    highRisk: false,
  },
  BM: {
    name: 'Bermuda',
    dialCode: '+1441',
    highRisk: false,
  },
  BT: {
    name: 'Bhutan',
    dialCode: '+975',
    highRisk: false,
  },
  BO: {
    name: 'Bolivia, Plurinational State of',
    dialCode: '+591',
    highRisk: false,
  },
  BA: {
    name: 'Bosnia and Herzegovina',
    dialCode: '+387',
    highRisk: false,
  },
  BW: {
    name: 'Botswana',
    dialCode: '+267',
    highRisk: false,
  },
  BR: {
    name: 'Brazil',
    dialCode: '+55',
    highRisk: false,
  },
  IO: {
    name: 'British Indian Ocean Territory',
    dialCode: '+246',
    highRisk: false,
  },
  BN: {
    name: 'Brunei Darussalam',
    dialCode: '+673',
    highRisk: false,
  },
  BG: {
    name: 'Bulgaria',
    dialCode: '+359',
    highRisk: false,
  },
  BF: {
    name: 'Burkina Faso',
    dialCode: '+226',
    highRisk: false,
  },
  BI: {
    name: 'Burundi',
    dialCode: '+257',
    highRisk: false,
  },
  KH: {
    name: 'Cambodia',
    dialCode: '+855',
    highRisk: false,
  },
  CM: {
    name: 'Cameroon',
    dialCode: '+237',
    highRisk: false,
  },
  CA: {
    name: 'Canada',
    dialCode: '+1',
    phoneAreaCodes: [
      '204',
      '226',
      '236',
      '249',
      '250',
      '289',
      '306',
      '343',
      '365',
      '403',
      '416',
      '418',
      '431',
      '437',
      '438',
      '450',
      '506',
      '514',
      '519',
      '579',
      '581',
      '587',
      '604',
      '613',
      '639',
      '647',
      '705',
      '709',
      '778',
      '780',
      '807',
      '819',
      '867',
      '873',
      '902',
      '905',
    ],
    highRisk: false,
  },
  CV: {
    name: 'Cape Verde',
    dialCode: '+238',
    highRisk: false,
  },
  KY: {
    name: 'Cayman Islands',
    dialCode: '+ 345',
    highRisk: false,
  },
  CF: {
    name: 'Central African Republic',
    dialCode: '+236',
    highRisk: false,
  },
  TD: {
    name: 'Chad',
    dialCode: '+235',
    highRisk: false,
  },
  CL: {
    name: 'Chile',
    dialCode: '+56',
    highRisk: false,
  },
  CN: {
    name: 'China',
    dialCode: '+86',
    highRisk: false,
  },
  CX: {
    name: 'Christmas Island',
    dialCode: '+61',
    highRisk: false,
  },
  CC: {
    name: 'Cocos (Keeling) Islands',
    dialCode: '+61',
    highRisk: false,
  },
  CO: {
    name: 'Colombia',
    dialCode: '+57',
    highRisk: false,
  },
  KM: {
    name: 'Comoros',
    dialCode: '+269',
    highRisk: false,
  },
  CG: {
    name: 'Congo',
    dialCode: '+242',
    highRisk: false,
  },
  CD: {
    name: 'Congo, The Democratic Republic of the Congo',
    dialCode: '+243',
    highRisk: false,
  },
  CK: {
    name: 'Cook Islands',
    dialCode: '+682',
    highRisk: false,
  },
  CR: {
    name: 'Costa Rica',
    dialCode: '+506',
    highRisk: false,
  },
  CI: {
    name: "Cote d'Ivoire",
    dialCode: '+225',
    highRisk: false,
  },
  HR: {
    name: 'Croatia',
    dialCode: '+385',
    highRisk: false,
  },
  CU: {
    name: 'Cuba',
    dialCode: '+53',
    highRisk: false,
  },
  CY: {
    name: 'Cyprus',
    dialCode: '+357',
    highRisk: false,
  },
  CZ: {
    name: 'Czech Republic',
    dialCode: '+420',
    highRisk: false,
  },
  DK: {
    name: 'Denmark',
    dialCode: '+45',
    highRisk: false,
  },
  DJ: {
    name: 'Djibouti',
    dialCode: '+253',
    highRisk: false,
  },
  DM: {
    name: 'Dominica',
    dialCode: '+1767',
    highRisk: false,
  },
  DO: {
    name: 'Dominican Republic',
    dialCode: '+1849',
    highRisk: false,
  },
  EC: {
    name: 'Ecuador',
    dialCode: '+593',
    highRisk: false,
  },
  EG: {
    name: 'Egypt',
    dialCode: '+20',
    highRisk: false,
  },
  SV: {
    name: 'El Salvador',
    dialCode: '+503',
    highRisk: false,
  },
  GQ: {
    name: 'Equatorial Guinea',
    dialCode: '+240',
    highRisk: false,
  },
  ER: {
    name: 'Eritrea',
    dialCode: '+291',
    highRisk: false,
  },
  EE: {
    name: 'Estonia',
    dialCode: '+372',
    highRisk: false,
  },
  ET: {
    name: 'Ethiopia',
    dialCode: '+251',
    highRisk: false,
  },
  FK: {
    name: 'Falkland Islands (Malvinas)',
    dialCode: '+500',
    highRisk: false,
  },
  FO: {
    name: 'Faroe Islands',
    dialCode: '+298',
    highRisk: false,
  },
  FJ: {
    name: 'Fiji',
    dialCode: '+679',
    highRisk: false,
  },
  FI: {
    name: 'Finland',
    dialCode: '+358',
    highRisk: false,
  },
  FR: {
    name: 'France',
    dialCode: '+33',
    highRisk: false,
  },
  GF: {
    name: 'French Guiana',
    dialCode: '+594',
    highRisk: false,
  },
  PF: {
    name: 'French Polynesia',
    dialCode: '+689',
    highRisk: false,
  },
  GA: {
    name: 'Gabon',
    dialCode: '+241',
    highRisk: false,
  },
  GM: {
    name: 'Gambia',
    dialCode: '+220',
    highRisk: false,
  },
  GE: {
    name: 'Georgia',
    dialCode: '+995',
    highRisk: false,
  },
  DE: {
    name: 'Germany',
    dialCode: '+49',
    highRisk: false,
  },
  GH: {
    name: 'Ghana',
    dialCode: '+233',
    highRisk: false,
  },
  GI: {
    name: 'Gibraltar',
    dialCode: '+350',
    highRisk: false,
  },
  GR: {
    name: 'Greece',
    dialCode: '+30',
    highRisk: false,
  },
  GL: {
    name: 'Greenland',
    dialCode: '+299',
    highRisk: false,
  },
  GD: {
    name: 'Grenada',
    dialCode: '+1473',
    highRisk: false,
  },
  GP: {
    name: 'Guadeloupe',
    dialCode: '+590',
    highRisk: false,
  },
  GU: {
    name: 'Guam',
    dialCode: '+1671',
    highRisk: false,
  },
  GT: {
    name: 'Guatemala',
    dialCode: '+502',
    highRisk: false,
  },
  GG: {
    name: 'Guernsey',
    dialCode: '+44',
    highRisk: false,
  },
  GN: {
    name: 'Guinea',
    dialCode: '+224',
    highRisk: false,
  },
  GW: {
    name: 'Guinea-Bissau',
    dialCode: '+245',
    highRisk: false,
  },
  GY: {
    name: 'Guyana',
    dialCode: '+595',
    highRisk: false,
  },
  HT: {
    name: 'Haiti',
    dialCode: '+509',
    highRisk: false,
  },
  VA: {
    name: 'Holy See (Vatican City State)',
    dialCode: '+379',
    highRisk: false,
  },
  HN: {
    name: 'Honduras',
    dialCode: '+504',
    highRisk: false,
  },
  HK: {
    name: 'Hong Kong',
    dialCode: '+852',
    highRisk: false,
  },
  HU: {
    name: 'Hungary',
    dialCode: '+36',
    highRisk: false,
  },
  IS: {
    name: 'Iceland',
    dialCode: '+354',
    highRisk: false,
  },
  IN: {
    name: 'India',
    dialCode: '+91',
    highRisk: false,
  },
  ID: {
    name: 'Indonesia',
    dialCode: '+62',
    highRisk: false,
  },
  IR: {
    name: 'Iran, Islamic Republic of Persian Gulf',
    dialCode: '+98',
    highRisk: true,
  },
  IQ: {
    name: 'Iraq',
    dialCode: '+964',
    highRisk: false,
  },
  IE: {
    name: 'Ireland',
    dialCode: '+353',
    highRisk: false,
  },
  IM: {
    name: 'Isle of Man',
    dialCode: '+44',
    highRisk: false,
  },
  IL: {
    name: 'Israel',
    dialCode: '+972',
    highRisk: false,
  },
  IT: {
    name: 'Italy',
    dialCode: '+39',
    highRisk: false,
  },
  JM: {
    name: 'Jamaica',
    dialCode: '+1876',
    highRisk: false,
  },
  JP: {
    name: 'Japan',
    dialCode: '+81',
    highRisk: false,
  },
  JE: {
    name: 'Jersey',
    dialCode: '+44',
    highRisk: false,
  },
  JO: {
    name: 'Jordan',
    dialCode: '+962',
    highRisk: false,
  },
  KZ: {
    name: 'Kazakhstan',
    dialCode: '+77',
    highRisk: false,
  },
  KE: {
    name: 'Kenya',
    dialCode: '+254',
    highRisk: false,
  },
  KI: {
    name: 'Kiribati',
    dialCode: '+686',
    highRisk: false,
  },
  KP: {
    name: "Korea, Democratic People's Republic of Korea",
    dialCode: '+850',
    highRisk: true,
  },
  KR: {
    name: 'Korea, Republic of South Korea',
    dialCode: '+82',
    highRisk: false,
  },
  KW: {
    name: 'Kuwait',
    dialCode: '+965',
    highRisk: false,
  },
  KG: {
    name: 'Kyrgyzstan',
    dialCode: '+996',
    highRisk: false,
  },
  LA: {
    name: 'Laos',
    dialCode: '+856',
    highRisk: false,
  },
  LV: {
    name: 'Latvia',
    dialCode: '+371',
    highRisk: false,
  },
  LB: {
    name: 'Lebanon',
    dialCode: '+961',
    highRisk: false,
  },
  LS: {
    name: 'Lesotho',
    dialCode: '+266',
    highRisk: false,
  },
  LR: {
    name: 'Liberia',
    dialCode: '+231',
    highRisk: false,
  },
  LY: {
    name: 'Libyan Arab Jamahiriya',
    dialCode: '+218',
    highRisk: false,
  },
  LI: {
    name: 'Liechtenstein',
    dialCode: '+423',
    highRisk: false,
  },
  LT: {
    name: 'Lithuania',
    dialCode: '+370',
    highRisk: false,
  },
  LU: {
    name: 'Luxembourg',
    dialCode: '+352',
    highRisk: false,
  },
  MO: {
    name: 'Macao',
    dialCode: '+853',
    highRisk: false,
  },
  MK: {
    name: 'Macedonia',
    dialCode: '+389',
    highRisk: false,
  },
  MG: {
    name: 'Madagascar',
    dialCode: '+261',
    highRisk: false,
  },
  MW: {
    name: 'Malawi',
    dialCode: '+265',
    highRisk: false,
  },
  MY: {
    name: 'Malaysia',
    dialCode: '+60',
    highRisk: false,
  },
  MV: {
    name: 'Maldives',
    dialCode: '+960',
    highRisk: false,
  },
  ML: {
    name: 'Mali',
    dialCode: '+223',
    highRisk: false,
  },
  MT: {
    name: 'Malta',
    dialCode: '+356',
    highRisk: false,
  },
  MH: {
    name: 'Marshall Islands',
    dialCode: '+692',
    highRisk: false,
  },
  MQ: {
    name: 'Martinique',
    dialCode: '+596',
    highRisk: false,
  },
  MR: {
    name: 'Mauritania',
    dialCode: '+222',
    highRisk: false,
  },
  MU: {
    name: 'Mauritius',
    dialCode: '+230',
    highRisk: false,
  },
  YT: {
    name: 'Mayotte',
    dialCode: '+262',
    highRisk: false,
  },
  MX: {
    name: 'Mexico',
    dialCode: '+52',
    highRisk: false,
  },
  FM: {
    name: 'Micronesia, Federated States of Micronesia',
    dialCode: '+691',
    highRisk: false,
  },
  MD: {
    name: 'Moldova',
    dialCode: '+373',
    highRisk: false,
  },
  MC: {
    name: 'Monaco',
    dialCode: '+377',
    highRisk: false,
  },
  MN: {
    name: 'Mongolia',
    dialCode: '+976',
    highRisk: false,
  },
  ME: {
    name: 'Montenegro',
    dialCode: '+382',
    highRisk: false,
  },
  MS: {
    name: 'Montserrat',
    dialCode: '+1664',
    highRisk: false,
  },
  MA: {
    name: 'Morocco',
    dialCode: '+212',
    highRisk: false,
  },
  MZ: {
    name: 'Mozambique',
    dialCode: '+258',
    highRisk: false,
  },
  MM: {
    name: 'Myanmar',
    dialCode: '+95',
    highRisk: true,
  },
  NA: {
    name: 'Namibia',
    dialCode: '+264',
    highRisk: false,
  },
  NR: {
    name: 'Nauru',
    dialCode: '+674',
    highRisk: false,
  },
  NP: {
    name: 'Nepal',
    dialCode: '+977',
    highRisk: false,
  },
  NL: {
    name: 'Netherlands',
    dialCode: '+31',
    highRisk: false,
  },
  AN: {
    name: 'Netherlands Antilles',
    dialCode: '+599',
    highRisk: false,
  },
  NC: {
    name: 'New Caledonia',
    dialCode: '+687',
    highRisk: false,
  },
  NZ: {
    name: 'New Zealand',
    dialCode: '+64',
    highRisk: false,
  },
  NI: {
    name: 'Nicaragua',
    dialCode: '+505',
    highRisk: false,
  },
  NE: {
    name: 'Niger',
    dialCode: '+227',
    highRisk: false,
  },
  NG: {
    name: 'Nigeria',
    dialCode: '+234',
    highRisk: false,
  },
  NU: {
    name: 'Niue',
    dialCode: '+683',
    highRisk: false,
  },
  NF: {
    name: 'Norfolk Island',
    dialCode: '+672',
    highRisk: false,
  },
  MP: {
    name: 'Northern Mariana Islands',
    dialCode: '+1670',
    highRisk: false,
  },
  NO: {
    name: 'Norway',
    dialCode: '+47',
    highRisk: false,
  },
  OM: {
    name: 'Oman',
    dialCode: '+968',
    highRisk: false,
  },
  PK: {
    name: 'Pakistan',
    dialCode: '+92',
    highRisk: false,
  },
  PW: {
    name: 'Palau',
    dialCode: '+680',
    highRisk: false,
  },
  PS: {
    name: 'Palestinian Territory, Occupied',
    dialCode: '+970',
    highRisk: false,
  },
  PA: {
    name: 'Panama',
    dialCode: '+507',
    highRisk: false,
  },
  PG: {
    name: 'Papua New Guinea',
    dialCode: '+675',
    highRisk: false,
  },
  PY: {
    name: 'Paraguay',
    dialCode: '+595',
    highRisk: false,
  },
  PE: {
    name: 'Peru',
    dialCode: '+51',
    highRisk: false,
  },
  PH: {
    name: 'Philippines',
    dialCode: '+63',
    highRisk: false,
  },
  PN: {
    name: 'Pitcairn',
    dialCode: '+872',
    highRisk: false,
  },
  PL: {
    name: 'Poland',
    dialCode: '+48',
    highRisk: false,
  },
  PT: {
    name: 'Portugal',
    dialCode: '+351',
    highRisk: false,
  },
  PR: {
    name: 'Puerto Rico',
    dialCode: '+1939',
    highRisk: false,
  },
  QA: {
    name: 'Qatar',
    dialCode: '+974',
    highRisk: false,
  },
  RO: {
    name: 'Romania',
    dialCode: '+40',
    highRisk: false,
  },
  RU: {
    name: 'Russia',
    dialCode: '+7',
    highRisk: false,
  },
  RW: {
    name: 'Rwanda',
    dialCode: '+250',
    highRisk: false,
  },
  RE: {
    name: 'Reunion',
    dialCode: '+262',
    highRisk: false,
  },
  BL: {
    name: 'Saint Barthelemy',
    dialCode: '+590',
    highRisk: false,
  },
  SH: {
    name: 'Saint Helena, Ascension and Tristan Da Cunha',
    dialCode: '+290',
    highRisk: false,
  },
  KN: {
    name: 'Saint Kitts and Nevis',
    dialCode: '+1869',
    highRisk: false,
  },
  LC: {
    name: 'Saint Lucia',
    dialCode: '+1758',
    highRisk: false,
  },
  MF: {
    name: 'Saint Martin',
    dialCode: '+590',
    highRisk: false,
  },
  PM: {
    name: 'Saint Pierre and Miquelon',
    dialCode: '+508',
    highRisk: false,
  },
  VC: {
    name: 'Saint Vincent and the Grenadines',
    dialCode: '+1784',
    highRisk: false,
  },
  WS: {
    name: 'Samoa',
    dialCode: '+685',
    highRisk: false,
  },
  SM: {
    name: 'San Marino',
    dialCode: '+378',
    highRisk: false,
  },
  ST: {
    name: 'Sao Tome and Principe',
    dialCode: '+239',
    highRisk: false,
  },
  SA: {
    name: 'Saudi Arabia',
    dialCode: '+966',
    highRisk: false,
  },
  SN: {
    name: 'Senegal',
    dialCode: '+221',
    highRisk: false,
  },
  RS: {
    name: 'Serbia',
    dialCode: '+381',
    highRisk: false,
  },
  SC: {
    name: 'Seychelles',
    dialCode: '+248',
    highRisk: false,
  },
  SL: {
    name: 'Sierra Leone',
    dialCode: '+232',
    highRisk: false,
  },
  SG: {
    name: 'Singapore',
    dialCode: '+65',
    highRisk: false,
  },
  SK: {
    name: 'Slovakia',
    dialCode: '+421',
    highRisk: false,
  },
  SI: {
    name: 'Slovenia',
    dialCode: '+386',
    highRisk: false,
  },
  SB: {
    name: 'Solomon Islands',
    dialCode: '+677',
    highRisk: false,
  },
  SO: {
    name: 'Somalia',
    dialCode: '+252',
    highRisk: false,
  },
  ZA: {
    name: 'South Africa',
    dialCode: '+27',
    highRisk: false,
  },
  SS: {
    name: 'South Sudan',
    dialCode: '+211',
    highRisk: false,
  },
  GS: {
    name: 'South Georgia and the South Sandwich Islands',
    dialCode: '+500',
    highRisk: false,
  },
  ES: {
    name: 'Spain',
    dialCode: '+34',
    highRisk: false,
  },
  LK: {
    name: 'Sri Lanka',
    dialCode: '+94',
    highRisk: false,
  },
  SD: {
    name: 'Sudan',
    dialCode: '+249',
    highRisk: false,
  },
  SR: {
    name: 'Suriname',
    dialCode: '+597',
    highRisk: false,
  },
  SJ: {
    name: 'Svalbard and Jan Mayen',
    dialCode: '+47',
    highRisk: false,
  },
  SZ: {
    name: 'Swaziland',
    dialCode: '+268',
    highRisk: false,
  },
  SE: {
    name: 'Sweden',
    dialCode: '+46',
    highRisk: false,
  },
  CH: {
    name: 'Switzerland',
    dialCode: '+41',
    highRisk: false,
  },
  SY: {
    name: 'Syrian Arab Republic',
    dialCode: '+963',
    highRisk: false,
  },
  TW: {
    name: 'Taiwan',
    dialCode: '+886',
    highRisk: false,
  },
  TJ: {
    name: 'Tajikistan',
    dialCode: '+992',
    highRisk: false,
  },
  TZ: {
    name: 'Tanzania, United Republic of Tanzania',
    dialCode: '+255',
    highRisk: false,
  },
  TH: {
    name: 'Thailand',
    dialCode: '+66',
    highRisk: false,
  },
  TL: {
    name: 'Timor-Leste',
    dialCode: '+670',
    highRisk: false,
  },
  TG: {
    name: 'Togo',
    dialCode: '+228',
    highRisk: false,
  },
  TK: {
    name: 'Tokelau',
    dialCode: '+690',
    highRisk: false,
  },
  TO: {
    name: 'Tonga',
    dialCode: '+676',
    highRisk: false,
  },
  TT: {
    name: 'Trinidad and Tobago',
    dialCode: '+1868',
    highRisk: false,
  },
  TN: {
    name: 'Tunisia',
    dialCode: '+216',
    highRisk: false,
  },
  TR: {
    name: 'Turkey',
    dialCode: '+90',
    highRisk: false,
  },
  TM: {
    name: 'Turkmenistan',
    dialCode: '+993',
    highRisk: false,
  },
  TC: {
    name: 'Turks and Caicos Islands',
    dialCode: '+1649',
    highRisk: false,
  },
  TV: {
    name: 'Tuvalu',
    dialCode: '+688',
    highRisk: false,
  },
  UG: {
    name: 'Uganda',
    dialCode: '+256',
    highRisk: false,
  },
  UA: {
    name: 'Ukraine',
    dialCode: '+380',
    highRisk: false,
  },
  AE: {
    name: 'United Arab Emirates',
    dialCode: '+971',
    highRisk: false,
  },
  GB: {
    name: 'Great Britain',
    dialCode: '+44',
    highRisk: false,
  },
  UK: {
    name: 'United Kingdom',
    dialCode: '+44',
    highRisk: false,
  },
  US: {
    name: 'United States',
    dialCode: '+1',
    highRisk: false,
  },
  UY: {
    name: 'Uruguay',
    dialCode: '+598',
    highRisk: false,
  },
  UZ: {
    name: 'Uzbekistan',
    dialCode: '+998',
    highRisk: false,
  },
  VU: {
    name: 'Vanuatu',
    dialCode: '+678',
    highRisk: false,
  },
  VE: {
    name: 'Venezuela, Bolivarian Republic of Venezuela',
    dialCode: '+58',
    highRisk: false,
  },
  VN: {
    name: 'Vietnam',
    dialCode: '+84',
    highRisk: false,
  },
  VG: {
    name: 'Virgin Islands, British',
    dialCode: '+1284',
    highRisk: false,
  },
  VI: {
    name: 'Virgin Islands, U.S.',
    dialCode: '+1340',
    highRisk: false,
  },
  WF: {
    name: 'Wallis and Futuna',
    dialCode: '+681',
    highRisk: false,
  },
  YE: {
    name: 'Yemen',
    dialCode: '+967',
    highRisk: false,
  },
  ZM: {
    name: 'Zambia',
    dialCode: '+260',
    highRisk: false,
  },
  ZW: {
    name: 'Zimbabwe',
    dialCode: '+263',
    highRisk: false,
  },
}

export type Country = keyof typeof countryMap
