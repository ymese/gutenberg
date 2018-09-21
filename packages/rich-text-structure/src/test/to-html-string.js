/**
 * External dependencies
 */

import { JSDOM } from 'jsdom';

/**
 * Internal dependencies
 */

import { createValue } from '../create';
import { toHTMLString } from '../to-html-string';

const { window } = new JSDOM();
const { document } = window;

function createNode( HTML ) {
	const doc = document.implementation.createHTMLDocument( '' );
	doc.body.innerHTML = HTML;
	return doc.body.firstChild;
}

describe( 'toHTMLString', () => {
	it( 'should extract recreate HTML 1', () => {
		const HTML = 'one <em>two 🍒</em> <a href="#"><img src=""><strong>three</strong></a><img src="">';

		expect( toHTMLString( createValue( createNode( `<p>${ HTML }</p>` ) ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 2', () => {
		const HTML = 'one <em>two 🍒</em> <a href="#">test <img src=""><strong>three</strong></a><img src="">';

		expect( toHTMLString( createValue( createNode( `<p>${ HTML }</p>` ) ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 3', () => {
		const HTML = '<img src="">';

		expect( toHTMLString( createValue( createNode( `<p>${ HTML }</p>` ) ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 4', () => {
		const HTML = '<em>two 🍒</em>';

		expect( toHTMLString( createValue( createNode( `<p>${ HTML }</p>` ) ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 5', () => {
		const HTML = '<em>If you want to learn more about how to build additional blocks, or if you are interested in helping with the project, head over to the <a href="https://github.com/WordPress/gutenberg">GitHub repository</a>.</em>';

		expect( toHTMLString( createValue( createNode( `<p>${ HTML }</p>` ) ) ) ).toEqual( HTML );
	} );

	it( 'should extract recreate HTML 6', () => {
		const HTML = '<li>one<ul><li>two</li></ul></li><li>three</li>';

		expect( toHTMLString( createValue( createNode( `<ul>${ HTML }</ul>` ), 'li' ), 'li' ) ).toEqual( HTML );
	} );
} );
