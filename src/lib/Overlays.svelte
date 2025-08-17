<script>
  // asdf
	import { getContext } from 'svelte';
	import { determine_node_array_orientation } from 'svedit';

	const svedit = getContext('svedit');

	let node_array_selection_paths = $derived(get_node_array_selection_paths());
	let node_cursor_info = $derived(get_node_cursor_info());

	function get_node_array_selection_paths() {
		const paths = [];
		const sel = svedit.doc.selection;
		if (!sel) return;

		// Node selection. Not collapsed.
		if (sel.type === 'node' && sel.anchor_offset !== sel.focus_offset) {
			const start = Math.min(sel.anchor_offset, sel.focus_offset);
			const end = Math.max(sel.anchor_offset, sel.focus_offset);

			for (let index = start; index < end; index++) {
				paths.push([...sel.path, index]);
			}
			return paths;
		}
	}

	function get_node_cursor_info() {
		const sel = svedit.doc.selection;
		if (!sel) return;

		if (sel.type === 'node' && sel.anchor_offset === sel.focus_offset) {
			const orientation = determine_node_array_orientation(svedit.doc, sel.path);
			let node_index, position;

			if (sel.anchor_offset === 0) {
				// Edge case: Cursor is at the very beginning
				node_index = sel.anchor_offset;
				position = 'before';
			} else {
				node_index = sel.anchor_offset - 1;
				position = 'after';
			}
			return {
				path: [...sel.path, node_index],
				position,
				orientation
			};
		}
	}
</script>

{#if svedit.doc.selection?.type === 'property'}
	<div
		class="property-selection-overlay"
		style="position-anchor: --{svedit.doc.selection.path.join('-')};"
	></div>
{/if}
<!-- Here we render  and other stuff that should lay atop of the canvas -->
<!-- NOTE: we are using CSS Anchor Positioning, which currently only works in the latest Chrome browser -->
{#if node_array_selection_paths}
	<!-- Render node selection fragments (one per selected node)-->
	{#each node_array_selection_paths as path (path.join('-'))}
		<div class="node-selection-fragment" style="position-anchor: --{path.join('-')};"></div>
	{/each}
{:else if node_cursor_info}
	<div
		class="node-cursor"
		class:horizontal={node_cursor_info.orientation === 'horizontal'}
		class:vertical={node_cursor_info.orientation === 'vertical'}
		class:after={node_cursor_info.position === 'after'}
		class:before={node_cursor_info.position === 'before'}
		style="position-anchor: --{node_cursor_info.path.join('-')};"
	></div>
{/if}


<style>
	/* This should be an exact overlay */
	.node-selection-fragment,
	.property-selection-overlay {
		position: absolute;
		background: var(--editing-fill-color);
		border: 1px solid var(--editing-stroke-color);
		border-radius: 2px;

		top: anchor(top);
		left: anchor(left);
		bottom: anchor(bottom);
		right: anchor(right);
		pointer-events: none;
	}

	.node-cursor {
		position: absolute;
		background: var(--editing-stroke-color);
		pointer-events: none;
		animation: blink 0.7s infinite;
	}

	.node-cursor.horizontal {
		width: 4px;
		top: anchor(top);
		bottom: anchor(bottom);
	}

	.node-cursor.vertical {
		height: 4px;
		left: anchor(left);
		right: anchor(right);
	}

	.node-cursor.before.horizontal {
		left: calc(anchor(left) - 2px);
	}

	.node-cursor.after.horizontal {
		right: calc(anchor(right) - 2px);
	}

	.node-cursor.before.vertical {
		top: calc(anchor(top) - 2px);
	}

	.node-cursor.after.vertical {
		bottom: calc(anchor(bottom) - 2px);
	}

	@keyframes blink {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
