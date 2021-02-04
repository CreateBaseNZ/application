Code Review
===========

Code reviews should be done prior to every version launch. It serves as a methodical process for us to ensure all code documentation is correct. However, we should be following documentation and common conventions as we code.

The following must be checked by each member during review:

- Cross-check invokations between documentation and flowchart. Ideally, the two are developed independently to make this process valid
- Correct spelling, grammar, and punctuation for function, parameter, and return descriptions
- Function and variables in the main constructor are in alphabetical order
- Queried elements that are invoked more than once should be declared in the `.elem` constructor alphabetically
- Function declarations are correctly grouped in sections divided by comment separators::

    // ======================
    // VARIABLES
    // ======================
