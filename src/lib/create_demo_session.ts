import {
	Session,
	SelectAllCommand,
	InsertDefaultNodeCommand,
	AddNewLineCommand,
	BreakTextNodeCommand,
	UndoCommand,
	RedoCommand,
	SelectParentCommand,
	define_document_schema,
	fill_document_defaults,
	define_keymap
} from 'svedit';

import Overlays from '$lib/Overlays.svelte';

import Page from '$lib/Page.svelte';
import Text from '$lib/Text.svelte';

const document_schema = define_document_schema({
	page: {
		kind: 'document',
		properties: {
			body: {
				type: 'node_array',
				node_types: ['text'],
				default_node_type: 'text'
			}
		}
	},
	text: {
		kind: 'text',
		properties: {
			layout: { type: 'integer' },
			content: {
				type: 'annotated_text',
				node_types: [],
				allow_newlines: false
			}
		}
	}
});

const doc = {
	document_id: 'page_a',
	nodes: {
		text_a: {
			id: 'text_a',
			type: 'text',
			layout: 1,
			content: { text: 'Text and structured content in symbiosis', annotations: [] }
		},
		page_a: {
			id: 'page_a',
			type: 'page',
			body: ['text_a']
		}
	}
};

// Only non-numeric ids are valid in Svedit because document paths are built from mixed string and number segments.
function generate_id(length = 16) {
	const id_alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const random_values = crypto.getRandomValues(new Uint8Array(length));
	let id = '';

	for (const random_value of random_values) {
		id += id_alphabet[random_value % id_alphabet.length];
	}

	return id;
}

// App-specific config object, always available via doc.config for introspection
const session_config = {
	generate_id,
	system_components: {
		overlays: Overlays
	},
	// Registry of components for each node type
	node_components: {
		page: Page,
		text: Text
	},
	node_layouts: {
		text: 4
	},
	/**
	 * Factory function to create Svedit commands and keymap.
	 * Called by Svedit component with the svedit context.
	 *
	 * @param {object} context - The svedit context with doc, editable, canvas.
	 * @returns {{ commands: object, keymap: object }}
	 */
	create_commands_and_keymap: (context) => {
		// Create command instances with the provided context
		const commands = {
			select_all: new SelectAllCommand(context),
			insert_default_node: new InsertDefaultNodeCommand(context),
			add_new_line: new AddNewLineCommand(context),
			break_text_node: new BreakTextNodeCommand(context),
			undo: new UndoCommand(context),
			redo: new RedoCommand(context),
			select_parent: new SelectParentCommand(context)
		};

		// Define keymap binding keys to commands
		const keymap = define_keymap({
			'meta+a,ctrl+a': [commands.select_all],
			enter: [commands.break_text_node, commands.insert_default_node],
			// In case of a node cursor, fall back to inserting a default node. This is needed
			// because on iOS selecting a node cursor triggers auto capitalization (shift pressed)
			'shift+enter': [commands.add_new_line, commands.insert_default_node],
			'meta+z,ctrl+z': [commands.undo],
			'meta+shift+z,ctrl+shift+z': [commands.redo],
			escape: [commands.select_parent]
		});

		return { commands, keymap };
	},

	// Custom functions to insert new "blank" nodes and setting the selection depening on the
	// intended behavior.
	inserters: {
		text: function (tr, content = { text: '', annotations: [] }, layout = 1) {
			const new_text = {
				id: session_config.generate_id(),
				type: 'text',
				layout,
				content
			};
			tr.create(new_text);
			tr.insert_nodes([new_text.id]);
			// NOTE: Relies on insert_nodes selecting the newly inserted node(s)
			tr.set_selection({
				type: 'text',
				path: [...tr.selection.path, tr.selection.focus_offset - 1, 'content'],
				anchor_offset: 0,
				focus_offset: 0
			});
		}
	}
};

export default function create_demo_session() {
	const demo_doc = fill_document_defaults(doc, document_schema);
	const session = new Session(document_schema, demo_doc, session_config);
	return session;
}
