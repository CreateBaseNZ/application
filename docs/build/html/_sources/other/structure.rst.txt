Code Structure
==============

Nesting Objects
---------------

Reasons for using nested objects include:

- Understandability
- Better structure
- Organised documentation

Declaration
-----------

Every JavaScript file should be initialised as follows::

  let main = {
    backend: {
      ...
    },

    init: {
      attachAllListeners: undefined,
      init: undefined,
      ...
    },

    elem: {
      ...
    },

    event: {
      ...
    },

    var: {
      ...
    },

    ...
  }

Some notes:

- Unused constructors should not be declared
- Additional constructors can be used for tidier code (e.g. ``global.nav`` in ``global``)
- Functions that belong to the main constructor should be declared below constructor declarations
- All declarations should be in alphabetical order, with the point above being the only exception

+---------------+----------------------------------------------+
| Constructor   | Rule                                         |
+===============+==============================================+
| ``_.backend`` | All functions that handle backend operations |
|               | (e.g. ``axios.post``).                       | 
+---------------+----------------------------------------------+
| ``_.init``    | All functions that are invoked in            |
|               | ``_.init.init()``.                           |
+---------------+----------------------------------------------+
| ``_.elem``    | All queried elements that are invoked more   |
|               | than once.                                   |
+---------------+----------------------------------------------+
| ``_.event``   | All functions that are passed to event       |
|               | listeners. These functions should only ever  |
|               | be invoked once and passed as a handle, or   |
|               | otherwise belong in another constructor or   |
|               | outside the ``_.event`` constructor.         |
+---------------+----------------------------------------------+
| ``_.var``     | Variables or constants that are used         |
|               | throughout the file.                         |
+---------------+----------------------------------------------+

Event Handler Functions
-----------------------

Every event listener is passed exactly one event handler function. This function *should* belong to ``_.event``, but this decision is ultimately at your discretion. Here are some pointers you may want to consider when deciding: 

- If the function invokes another function while only adding a few extra lines of code, **do** put it in the constructor
- If the function is specific to the functionality of one event listener, **do** put it in the constructor
- If the function is invoked more than once, do **not** put it in the constructor
- If the function contributes more to a different functionality (e.g. backend), put it in **another constructor** (e.g. ``_.backend``)

To use ``this``, the function must be declared using ``function()`` and not with the arrow function ``=>``. 

To use the event object/``e``/``evt``, simply pass it as a parameter in the function declaration. Both ``function(e)`` and ``(e) =>`` will work.

Sometimes we may want to invoke a function whilst passing it a parameter. However, as only function handles are passed to event listeners, parameters must be passed through other means. Below is an example of the correct and incorrect method of doing so:

❌ Incorrect::

  document.querySelector('button').addEventListener('click', () => {
    main.generalFunction('a button')
  })

✔️ Correct::

  document.querySelector('button').addEventListener('click', main.event.buttonClick)

  main.event.buttonClick = () => {
    main.generalFunction('a button')
  }

This comes at the cost of longer files and more code, however, the upsides include:

- Ability to easily add and remove event listeners
- Easier to track invokations
- Easier to document