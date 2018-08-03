import { Component } from '@wordpress/element';

class Annotations extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			annotationsLength: 0,
		};
	}

	/**
	 * Prevents re-rendering if the same annotations are passed. This prevents
	 * performance issues when the change tracking in tinyMCE adjusts the
	 * annotations and this component receives new annotations.
	 *
	 * This has the downside that annotations cannot be moved from the outside. This
	 * can easily be solved by inserting an annotation with a new ID instead. This
	 * forces a re-render by this component.
	 *
	 * @param {Object} nextProps The new props this component will receive.
	 *
	 * @return {boolean} Whether this component should be re-rendered.
	 */
	shouldComponentUpdate( nextProps ) {
		return Annotations.combineAnnotationIds( nextProps.annotations ) !== this.state.annotationIds;
	}

	/**
	 * Combines annotation ids into a string seperated by dashes.
	 *
	 * @param {Object[]} annotations Annotation objects.
	 *
	 * @return {string} Combined annotation IDs.
	 */
	static combineAnnotationIds( annotations ) {
		return annotations.map( ( ids, annotation ) => {
			return ids + '-' + annotation.id;
		} ).join( '-' );
	}

	/**
	 * Returns state changes necessary for new props.
	 *
	 * @param {Object} props The props this component received.
	 *
	 * @return {Object} The state changes that are required by the given props.
	 */
	static getDerivedStateFromProps( props ) {
		return {
			annotationIds: Annotations.combineAnnotationIds( props.annotations ),
		};
	}

	/**
	 * Sets up event handlers to track changes to annotations.
	 */
	componentDidMount() {
		const editor = this.props.editor;

		editor.on( 'wp.annotation-moved', ( data ) => {
			this.props.onMove( data.uid, data.xpath );
		} );
	}

	/**
	 * Calls the annotation methods on the annotations plugin.
	 *
	 * This causes us to have a declarative API on top of tinyMCE's imperative API.
	 *
	 * @return {WPElement} Might render debugging information.
	 */
	render() {
		const { annotations, editor } = this.props;

		const annotationsPlugin = editor.plugins[ 'wp-annotations' ];

		try {
			// This way we get a declarative UI for annotations on top of the imperative
			// UI of tinyMCE.
			annotationsPlugin.removeAllAnnotations();
			annotationsPlugin.setAnnotations( annotations.map( ( annotation ) => {
				return {
					uid: annotation.id,
					xpath: {
						start: annotation.startXPath,
						startOffset: annotation.startOffset,
						end: annotation.endXPath,
						endOffset: annotation.endOffset,
					},
				};
			} ) );

		// Catch here because componentDidCatch catches only in child components.
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error occurred in anotations module', error );
			// this.props.onError();
		}

		// Debugging information makes it much easier to develop annotations.
		// This if should be stripped in the production build.
		if ( process.env.NODE_ENV === 'development' ) {
			return this.renderDebug();
		}

		return null;
	}

	/**
	 * Renders debugging information that makes it much easier to see why a certain
	 * annotation didn't apply.
	 *
	 * @return {WPElement} The rendered React tree.
	 */
	renderDebug() {
		const ReactJson = require( 'react-json-view' ).default;

		const styles = {
			border: '1px solid red',
		};

		return <div className="annotation-marker-debug" style={ styles }>
			<h3>Raw HTML content</h3>
			{ this.props.editor.getContent() }

			<h3>Annotations JSON</h3>
			<ReactJson src={ this.props.annotations } />
		</div>;
	}
}

export default Annotations;
