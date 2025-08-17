import { Document, define_document_schema, svid } from 'svedit';
import Page from '$lib/Page.svelte';
import Text from '$lib/Text.svelte';

const document_schema = define_document_schema({
  page: {
    body: {
      type: 'node_array',
      node_types: ['text'],
      default_node_type: 'text',
    },
  },
  text: {
    layout: { type: 'integer' },
    content: { type: 'annotated_string' },
  }
});

// Generate IDs for all content nodes
const page_1_id = 'page_1';
const text_1_id = 'text_1';

const raw_doc = [
  {
    id: text_1_id,
    type: 'text',
    layout: 1,
    content: ['Text and structured content in symbiosis', []]
  },
  // IMPORTANT: The root node (entry point) must be the last one in the array
  {
    id: page_1_id,
    type: 'page',
    body: [text_1_id],
  },
];

// App-specific config object, always available via doc.config for introspection
const document_config = {
  // Registry of components for each node type
  node_components: {
    page: Page,
    text: Text,
  },
  node_layouts: {
    text: 4,
  },
  // Those node types have horizontal-ish node_arrays
  // E.g. used by Overlays.svelte to render node cursors the right way.
  node_types_with_horizontal_node_arrays: [],
  // Custom functions to insert new "blank" nodes and setting the selection depening on the
  // intended behavior.
  inserters: {
    text: function(tr, content = ['', []], layout = 1) {
      const new_text = {
   			id: svid(),
   			type: 'text',
        layout,
   			content
  		};
  		tr.insert_nodes([new_text]);
      // NOTE: Relies on insert_nodes selecting the newly inserted node(s)
      tr.set_selection({
        type: 'text',
        path: [...tr.doc.selection.path, tr.doc.selection.focus_offset - 1 , 'content'],
        anchor_offset: 0,
        focus_offset: 0
      });
    },
  }
};

export default function create_demo_doc() {
  const doc = new Document(document_schema, raw_doc, { config: document_config });
  return doc;
};
