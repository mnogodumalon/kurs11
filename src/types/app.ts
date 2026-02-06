// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Dozenten {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    fachgebiet?: string;
  };
}

export interface Teilnehmer {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    geburtsdatum?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface Raeume {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    raumname?: string;
    gebaeude?: string;
    kapazitaet?: number;
  };
}

export interface Kurse {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    titel?: string;
    beschreibung?: string;
    startdatum?: string; // Format: YYYY-MM-DD oder ISO String
    enddatum?: string; // Format: YYYY-MM-DD oder ISO String
    max_teilnehmer?: number;
    preis?: number;
    dozent?: string; // applookup -> URL zu 'Dozenten' Record
    raum?: string; // applookup -> URL zu 'Raeume' Record
  };
}

export interface Anmeldungen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    teilnehmer?: string; // applookup -> URL zu 'Teilnehmer' Record
    kurs?: string; // applookup -> URL zu 'Kurse' Record
    anmeldedatum?: string; // Format: YYYY-MM-DD oder ISO String
    bezahlt?: boolean;
  };
}

export const APP_IDS = {
  DOZENTEN: '6985d03078ae9dbf93526dca',
  TEILNEHMER: '6985d030d7588ee37aeb42db',
  RAEUME: '6985d03133bdbb8911d48f57',
  KURSE: '6985d03185d0dda331afe83a',
  ANMELDUNGEN: '6985d031eac4a175430940ce',
} as const;

// Helper Types for creating new records
export type CreateDozenten = Dozenten['fields'];
export type CreateTeilnehmer = Teilnehmer['fields'];
export type CreateRaeume = Raeume['fields'];
export type CreateKurse = Kurse['fields'];
export type CreateAnmeldungen = Anmeldungen['fields'];