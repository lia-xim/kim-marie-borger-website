# Tracking Events

Diese Datei beschreibt die Umami-Events der Website. Ziel ist ein stabiles,
privacy-schonendes Tracking fuer Funnel-Auswertung und spaeteres A/B-Testing.

## Grundregeln

- Keine Namen, E-Mail-Adressen, Telefonnummern, Orte, konkreten Termine oder Nachrichtentexte an Umami senden.
- Freitext wird nur als Laengen-Bucket erfasst: `empty`, `short`, `medium`, `long`.
- Formular- und Server-Events duerfen Attribution enthalten, aber keine Rohwerte von `gclid`, `fbclid` oder `msclkid`; nur `has_*` Flags.
- Event-Namen bleiben stabil und werden nicht fuer kurzfristige Kampagnen umbenannt.

## Globale Properties

Jeder Browser-Event enthaelt:

| Property | Bedeutung |
| --- | --- |
| `page_path` | Pfad ohne trailing slash, Startseite als `/` |
| `page_type` | `home`, `portfolio`, `inquiry`, `service`, `local_seo`, `guide_index`, `guide_article` oder Root-Segment |
| `page_service` | Service-Segment bei Leistungs-/SEO-Seiten, z. B. `hochzeiten` |
| `page_slug` | Unterpfad nach dem Service-Segment |
| `page_title` | Aktueller Dokumenttitel |

## Attribution Properties

Kontakt- und wichtige CTA-Events enthalten je nach Verfuegbarkeit:

| Property | Bedeutung |
| --- | --- |
| `attribution_first_path` / `attribution_last_path` | Erste und letzte bekannte Seite der Session |
| `attribution_first_page_type` / `attribution_last_page_type` | Seitentyp der ersten und letzten Seite |
| `attribution_first_utm_*` / `attribution_last_utm_*` | UTM-Quelle, Medium, Kampagne, Content, Term |
| `attribution_first_has_gclid` / `attribution_last_has_gclid` | Google Ads Click-ID war vorhanden, ohne Rohwert |
| `attribution_first_has_fbclid` / `attribution_last_has_fbclid` | Meta Click-ID war vorhanden, ohne Rohwert |
| `attribution_first_has_msclkid` / `attribution_last_has_msclkid` | Microsoft Ads Click-ID war vorhanden, ohne Rohwert |
| `attribution_last_cta_*` | Letzte wichtige CTA vor der Anfrage: Text, Bereich, Ziel, Event-Typ |
| `attribution_audio_engaged` | Portfolio-Audio wurde abgespielt |
| `attribution_audio_last_track` | Letzter ausgewaehlter oder abgespielter Portfolio-Track |

## Event Dictionary

| Event | Wann ausgelöst | Wichtige Properties |
| --- | --- | --- |
| `page_scroll_depth` | Nutzer erreicht 25, 50, 75 oder 90 Prozent Scrolltiefe | `depth`, `max_scroll` |
| `page_engaged` | Nutzer bleibt 30 oder 90 Sekunden auf der Seite | `seconds`, `max_scroll` |
| `site_link_click` | Wichtiger interner/externer Link ohne Kontakt- oder Social-Bezug | `link_area`, `link_text`, `link_target`, `link_kind` |
| `inquiry_cta_click` | CTA fuehrt zu `/anfragen` oder `#kontakt` | `link_area`, `link_text`, `link_target`, Attribution |
| `contact_email_click` | Direkter Mail-Link wird geklickt | `link_area`, `link_text`, Attribution |
| `social_click` | Social-Profil oder Social-Link wird geklickt | `social_platform`, `link_area`, `link_target` |
| `contact_form_view` | Formular ist sichtbar | `form_context`, `form_variant`, `source_context`, Attribution |
| `contact_form_start` | Erstes Input-/Change-Ereignis im Formular | `first_field`, Formular-Metadaten, Attribution |
| `contact_form_validation_error` | Browservalidierung verhindert Absenden | `invalid_count`, `invalid_fields`, Completion-Flags, Attribution |
| `contact_form_submit_attempt` | Valides Formular wird an `/api/contact` gesendet | Completion-Flags, `message_bucket`, Attribution |
| `contact_form_honeypot_submit` | Honeypot-Feld ist gefuellt | Formular-Metadaten, Completion-Flags |
| `contact_form_success` | Browser erhaelt erfolgreiche API-Antwort | `delivery` (`api` oder `queued`), Completion-Flags, Attribution |
| `contact_form_error` | API- oder Netzwerkfehler im Browser | `error_type`, `status`, Completion-Flags, Attribution |
| `contact_form_abandon` | Formular wurde begonnen, aber vor validem Submit verlassen | `abandon_trigger`, Completion-Flags, Attribution |
| `contact_form_server_success` | `/api/contact` akzeptiert eine Anfrage serverseitig | `delivery_status`, `outbox_status`, Completion-Flags, Attribution |
| `portfolio_audio_view` | Portfolio-Player ist sichtbar | `track_count`, `real_track_count` |
| `portfolio_audio_track_select` | Track wird in der Playlist ausgewaehlt | `track_index`, `track_title`, `composer`, `autoplay` |
| `portfolio_audio_play` | Audio oder Klangskizze startet erfolgreich | `track_index`, `track_title`, `mode`, `trigger` |
| `portfolio_audio_progress` | Echter Audio-Track erreicht 25, 50, 75 oder 90 Prozent | `progress`, `elapsed_seconds`, `duration_seconds` |
| `portfolio_audio_pause` | Wiedergabe wird pausiert | `trigger`, `elapsed_seconds`, `mode` |
| `portfolio_audio_complete` | Echter Audio-Track endet | `track_index`, `track_title`, `mode` |
| `portfolio_audio_error` | Browser kann echten Audio-Track nicht abspielen | `error_type`, `track_index`, `track_title` |
| `portfolio_image_open` | Portfolio-Lightbox wird geoeffnet | `image_index`, `image_label` |
| `portfolio_image_nav` | Portfolio-Lightbox navigiert | `direction`, `method`, `image_index` |
| `video_play` | YouTube-Fassade wird durch Iframe ersetzt | `video_provider`, `video_id`, `link_area` |

## Empfohlene Funnels

Kontakt-Funnel:

1. `contact_form_view`
2. `contact_form_start`
3. `contact_form_submit_attempt`
4. `contact_form_success` oder `contact_form_server_success`

Abbruch-Funnel:

1. `contact_form_view`
2. `contact_form_start`
3. `contact_form_abandon`

Portfolio-zu-Anfrage-Funnel:

1. `portfolio_audio_view`
2. `portfolio_audio_play`
3. `inquiry_cta_click`
4. `contact_form_start`
5. `contact_form_server_success`

A/B-Test-Auswertung:

- Variante ueber `form_variant`, `form_context`, `source_context` oder kuenftige `experiment_*` Properties vergleichen.
- Primaere Kennzahl: `contact_form_server_success` pro `contact_form_view`.
- Sekundaere Kennzahlen: `contact_form_start`, `contact_form_abandon`, `message_bucket`, `optional_fields_count`.
