/**
 * Internal dependencies
 */
import { visitAdmin } from '../support/utils';

const MOCK_EMBED_RESPONSE = {
	html: '<p>Embed response.</p>',
};

describe( 'new editor state', () => {
	beforeAll( async () => {
		// Intercept embed requests so that scripts loaded from third parties
		// cannot leave errors in the console and cause the test to fail.
		await page.setRequestInterceptionEnabled( true );
		page.on( 'request', ( request ) => {
			if ( request.url === '/index.php?rest_route=/oembed/1.0/proxy&url=https%3A%2F%2Fvimeo.com%2F22439234' ) {
				request.respond( {
					content: 'application/json',
					body: JSON.stringify( MOCK_EMBED_RESPONSE ),
				} );
			} else {
				request.continue();
			}
		} );
		await visitAdmin( 'post-new.php', 'gutenberg-demo' );
	} );

	it( 'should not error', () => {
		// This test case is intentionally empty. The `beforeAll` lifecycle of
		// navigating to the Demo page is sufficient assertion in itself, as it
		// will trigger the global console error capturing if an error occurs
		// during this process.
		//
		// If any other test cases are added which verify expected behavior of
		// the demo post, this empty test case can be removed.
	} );
} );
