/** Patterns guarded across public app routes and llms files (TS-4169). */
export const stillOpenTbcpNegpCopy =
  /\b(?:close|closes|due|by)\s+Nov(?:ember|\.)?\s+17|application-window|during the application window|window is open|framing TBCP applications/i;

export const regionalUsCanadaBrokerageLimit = /across the US and Canada/i;