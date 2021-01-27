<!-- ---
title: "Settings Frontend Documentation"
author: "Louis Lin"
date: "27-01-2021"
--- -->

# Settings

This is the documentation for `settings.js`, the main JavaScript for the Settings page.

## Table of Contents

- [Front-end Functions](#Front-end-functions)
  - [`initialise`](#settings.initialise)
  - [`cacheData`](#settings.cacheData)
  - [`cancelAccount`](#settings.cancelAccount)
- [Variables](#variables)
- [Back-end Requests](#back-end-requests)

## Front-end Functions

### List of functions

#### `settings.initialise`

Gets called on DOM load and initialises the page. User data is retrieved (`settings.fetch`) to populate the page (`settings.populate`, `settings.loadBadges`). After loading in all DOM, event listeners are attached to relevant elements (`settings.loadEventListeners`) and user data is cached (`settings.cacheData`). Session storage is checked for any references from the previous page (`settings.fromPreviousPage`).

##### Parameters

- `null`

##### Returns

- `null`

##### Invokes

[`settings.fetch`](###settings.fetch), [`settings.fromPreviousPage`](###settings.loadEventListeners), [`settings.loadBadges`](###settings.loadBadges), [`settings.loadEventListeners`](###settings.loadEventListeners)

##### Invoked by

`null`

---

#### `settings.cacheData`

A description of function and what it does

##### Parameters

- `Parameter` [type]: Brief description of argument

##### Returns

- `Output` [type]: Brief description of output

##### Invokes

[`list`](###), [`of`](###), [`functions`](###), [`that`](###), [`are`](###), [`called`](###)

##### Invoked by

[`list`](###), [`of`](###), [`functions`](###), [`that`](###), [`calls`](###), [`it`](###)

## Variables

## Back-end Requests

### `settings.cancelAccount`

### `settings.fetch`

## Template

### `function.name`

A description of function and what it does

#### Parameters

- `Parameter` [type]: Brief description of argument

#### Returns

- `Output` [type]: Brief description of output

#### Invokes

[`list`](###), [`of`](###), [`functions`](###), [`that`](###), [`are`](###), [`called`](###)

#### Invoked by

[`list`](###), [`of`](###), [`functions`](###), [`that`](###), [`calls`](###), [`it`](###)