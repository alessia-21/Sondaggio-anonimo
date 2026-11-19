# Sondaggio anonimo su Cloudflare Pages

## Cosa fa
- Pagina pubblica con tre scelte: A, B e C.
- Nessun account, nome o email.
- Risultati accessibili solo con una chiave amministratore.
- D1 salva la scelta e un hash di un token casuale del browser; non salva il token originale né un'identità.
- Un voto per browser, finché i dati del sito non vengono cancellati.

**Limite importante:** non è un'identificazione certa del dispositivo. Un utente può aggirare il limite cancellando i dati del browser, usando un altro browser o un altro dispositivo. Evitiamo fingerprinting e raccolta IP.

## Pubblicazione

1. Crea un account su Cloudflare.
2. Crea un database D1 chiamato `sondaggio-anonimo-db`.
3. Copia il `database_id` mostrato da Cloudflare nel file `wrangler.toml`, al posto di `INSERISCI_QUI_IL_DATABASE_ID`.
4. Dalla cartella del progetto, installa Wrangler: `npm install -D wrangler`.
5. Crea la tabella: `npx wrangler d1 migrations apply sondaggio-anonimo-db --remote`.
6. Pubblica il progetto come Cloudflare Pages, collegando il repository Git oppure usando Wrangler.
7. Nelle impostazioni del progetto Pages, aggiungi la variabile/secret `ADMIN_TOKEN` con una password lunga e casuale. Non inserirla nei file pubblici.
8. Verifica che il binding D1 `DB` sia collegato al database creato.
9. Apri l'indirizzo del sito. La pagina di voto è `/`; i risultati riservati sono in `/admin.html`.

Per pubblicare da terminale con Wrangler, dopo aver configurato D1 e il secret:
`npx wrangler pages deploy public --project-name sondaggio-anonimo`

Per un progetto Pages già creato, assicurati di distribuire anche la cartella `functions/` (il deploy da repository Git lo fa automaticamente). Il comando CLI `pages deploy public` da solo non include le Pages Functions: per un deploy CLI completo usa il flusso Pages con directory progetto che contenga `functions/`, oppure collega il repository Git a Pages.

## Privacy
Il database contiene il voto, un hash casuale usato per impedire un secondo voto dallo stesso browser e l'ora di registrazione. Non conserva nomi, email o indirizzi IP. Chi amministra il database può vedere i conteggi e anche i singoli record A/B/C, ma non può ricavare da questi dati il significato segreto delle lettere.
