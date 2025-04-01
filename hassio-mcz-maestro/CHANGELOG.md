<!-- https://developers.home-assistant.io/docs/add-ons/presentation#keeping-a-changelog -->

## 1.4.0

- Add ability to control stove power (ON/OFF) via climate entity.
- Add ability to control target temperature via climate entity.
- Add ability to control Eco Stop mode via a new switch entity.
- Improve state reporting reactivity in Home Assistant (optimistic mode, faster refresh).
- Correct mapping of IDLE state for climate entity.

## 1.3.0

[Full change log 1.3.0](https://github.com/bertrandgressier/mcz-stove-gateway/releases/tag/1.3.0)

- Display the stove idling in the climate entity

## 1.2.1

[Full change log 1.2.1](https://github.com/bertrandgressier/mcz-stove-gateway/releases/tag/1.2.1)

- fix status state

## 1.2.0

[Full change log 1.2.0](https://github.com/bertrandgressier/mcz-stove-gateway/releases/tag/1.2.0)

- Add Stove status (first basic implementation)

## 1.1.0

[Full change log 1.1.0](https://github.com/bertrandgressier/mcz-stove-gateway/releases/tag/1.1.0)

- Add climate entity
- Add sensors (fumes, rpm, power, temperature)
- Add binary sensor (eco mode )

## 1.0.0

[Full change log](https://github.com/bertrandgressier/mcz-stove-gateway/releases/tag/1.0.0)

- Initialize the project
- Every minute stove information is pushed into MQTT
