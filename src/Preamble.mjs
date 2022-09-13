/*
 * This file is a part of Asciidoctor Chunker project.
 * Copyright (c) 2021 Wataru Shito (@waterloo_jp)
 */

'use strict';

/*
  extract inside the bracket:
    [#preamble]
    [.sect0, some nodes]
    [.sect1,
       +-- some nodes]
       +-- [.sect2
             +-- some nodes]
             +-- [sect3
                   +-- some nodes
                   +-- and so on...]
    [.sect1, ...]
    [.sect0, ...]

  So #preamble and .sect0 do not go into recursively.
  sect0 is for Part.  sect1 is for Chapter.
  sect1 (h2) -- sect5 (h6)
*/

/**
 * This is the factory function that returns the preamble extractor
 * function which extracts the preamble section with `#preamble` id.
 *
 * The returned function from this factory is to be used as a
 * callback function for the content processor, i.e. the
 * `processContents()` defined in `ContentProcessor.mjs`.
 *
 * The returned function by this factory has the following
 * parameters.
 *
 * @param {object} config: The configuration object which has
 *  `depth` property to specify the maximum sectLevel to extract.
 *  Currently `confi` is not used by the part extractor.
 * @param {Node} docRoot The root Node instance of the asciidoctor's
 *  single HTML source.
 * @param {Node} preambleNode The preamble node that is
 *  'div#preamble'.
 * @param {boolean} isFirstPage true if this is the index.html page.
 *
 * This factory takes the following parameters:
 *
 * @param {(fnamePrefix: string, dom: Node) => void} printer
 *  The callback function that actually handles the extracted
 *  part contents.  The printer function takes the basename
 *  of the output file and the Node instance of the html to
 *  print out to the file.
 * @param {Node} container The dom of the root which has empty
 *  `div#content` and is used as a skelton.  The `printer` uses
 *  the cloned DOM to write out the chunked html.
 *  This is passed and kept in closure beforehand to be used
 *  as a template repeatedly.
 * @param {(
 *  fnamePrefix: string,
 *  thisSecLevel: number,
 *  sectionNumber: number
 *  ) => string} basenameMaker `NOT IMPLEMENTED` The function
 *  that generates the basename for output html.
 * @param {(
 *  config: object,
 *  basename: string,
 *  container: Node,
 *  contents: Node*
 * ) => {Node}} documentMaker The function that clones the
 *  given container and appends nodes under div#content.
 */
const getPreambleExtractor = (printer, container, documentMaker) =>
  (config, docRoot, preambleNode, isFirstPage) => {
    const basename = isFirstPage ? 'index' : 'preamble';
    printer(basename, documentMaker(config, basename, container, preambleNode));
  }

export default getPreambleExtractor;
