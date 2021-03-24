api
===

## Log level

Mapping between [LogSeverity for Cloud Logging](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity) and [zerolog](https://github.com/rs/zerolog)

| LogSeverity | description | zerolog |
|---|---|---|
| DEFAULT	(0) | The log entry has no assigned severity level. | trace (-1) |
| DEBUG	(100) | Debug or trace information. | debug (0) |
| INFO (200) | Routine information, such as ongoing status or performance. | info (1) |
| NOTICE (300) | Normal but significant events, such as start up, shut down, or a configuration change. | none |
| WARNING	(400) | Warning events might cause problems. | warn (2) |
| ERROR (500) | Error events are likely to cause problems. | error (3) |
| CRITICAL (600) | Critical events cause more severe problems or outages. | fatal (4) |
| ALERT (700) | A person must take an action immediately. | none |
| EMERGENCY (800) | One or more systems are unusable. | panic (5) |
