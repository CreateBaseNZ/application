Other
=====

.. toctree::
    :caption: Content
    :maxdepth: 1

    structure.rst
    code-review.rst

Setup
-----

1. Install Sphinx::

    > pip install -U sphinx

2. Install JSDoc::

    > npm install -g jsdoc

3. Install sphinx-js::

    > pip install sphinx-js

4. Install sphinxemoji::

    > pip install sphinxemoji

To compile, navigate to the ``docs`` directory and run::

    > make html

JavaScript Docstring Guide
--------------------------

This is the standard docstring template we use::

  /**
   * Function description with full grammar and punctuation.
   *
   * | **Invokes**
   * | :func:`separateFunctions` :func:`withSpaces`
   *
   * | **Invoked by**
   * | :func:`theseAreAutomaticallyGenerated` :func:`willBeIgnoredIfTyped`
   *
   * @param {Type} name     Variable description with full grammar and punctuation.
   * @param {Type} name2    Tab-aligned descriptions are easier to read, but don't affect how the doc is rendered.
   * @returns {Type} name3  Tab-aligned descriptions are easier to read, but don't affect how the doc is rendered.
  */

Some things to note:

- Docstrings begin with ``/**`` immediately followed with the function description on the next line
- Function descriptions should have correct spelling and grammar with full punctuation
- The ``|`` preserve line breaks and indents for rst markup
- Words enclosed in ``**`` are **bold**
- Prepending functions with ``:func:`` and enclosing with ````` creates :func:`cross-references` to the respective functions
- Cross-referenced functions are separated with spaces
- The lines::

     * | **Invoked by**
     * | :func:`theseAreAutomaticallyGenerated` :func:`willBeIgnoredIfTyped`

  do not need to be manually entered. The custom ``invoked_by`` Sphinx extension automatically generates both the **Heading** and the :func:`functions`. Although, including these will have no effect on the auto generation--they will either be ignored, removed, or overwritten
- Inputs are denoted by ``@param`` and outputs by ``@returns``. These are followed by the ``Type`` (capitalised), ``name`` (camelCase), and a brief description. Descriptions should be in correct English writing and tab-aligned for easier readability
- There are many nuances to JavaScript types; when in doubt use::

    > console.log(typeof myVariable)

  to check. Here's a simple table of common types:
  
  +------------------------+-----------------+
  | value                  | typeof          | 
  +========================+=================+
  | ``undefined``          | ``"undefined"`` |
  +------------------------+-----------------+
  | ``null``               | ``"object"``    |
  +------------------------+-----------------+
  | ``true`` or ``false``  | ``"boolean"``   |
  +------------------------+-----------------+
  | all numbers or ``NaN`` | ``"number"``    |
  +------------------------+-----------------+
  | all strings            | ``"string"``    |
  +------------------------+-----------------+
  | all functions          | ``"function"``  |
  +------------------------+-----------------+
  | all elements           | ``"object"``    |
  +------------------------+-----------------+
  | all arrays             | ``"object"``    |
  +------------------------+-----------------+
  | native objects         | ``"object"``    |
  +------------------------+-----------------+
  | other objects          | ``"object"``    |
  +------------------------+-----------------+

- Avoid using::

    /* ===============
    VARIABLES
    ================*/

  Instead, use::

    // ===============
    // VARIABLES
    // ===============

If all goes well, when rendered, the function will look something like this:

.. function:: someFunction(name, name2)

    Function description with full grammar and punctuation.

    | **Invokes**
    | :func:`separateFunctions` :func:`withSpaces`

    | **Invoked by**
    | :func:`theseAreAutomaticallyGenerated` :func:`willBeIgnoredIfTyped`

    :param Type name: Variable description with full grammar and punctuation.
    :param Type name2: Tab-aligned descriptions are easier to read, but don't affect how the doc is rendered.
    :return: **Type** -- name - Tab-aligned descriptions are easier to read, but don't affect how the doc is rendered.

Useful Links
------------

- `rst CheatSheet <https://bashtage.github.io/sphinx-material/rst-cheatsheet/rst-cheatsheet.html>`_
- `Jsdoc cheatsheet <https://devhints.io/jsdoc>`_
- `Introducing sphinx-js, a better way to document large JavaScript projects <https://hacks.mozilla.org/2017/07/introducing-sphinx-js-a-better-way-to-document-large-javascript-projects/>`_
- `sphinx-js 3.1 <https://pypi.org/project/sphinx-js/>`_