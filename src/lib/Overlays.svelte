<script>
	import { getContext } from 'svelte';
	const svedit = getContext('svedit');

	let node_array_selection_paths = $derived(get_node_array_selection_paths());

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
</style>
