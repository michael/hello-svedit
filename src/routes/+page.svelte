<script lang="ts">
	// For a more comprehensive integration example, see:
	// https://github.com/michael/svedit/blob/main/src/routes/%2Bpage.svelte
	import { setContext } from 'svelte';
	import { Svedit, KeyMapper } from 'svedit';
	import create_demo_session from '$lib/create_demo_session';

	const session = create_demo_session();

	// Create KeyMapper and provide via context
	const key_mapper = new KeyMapper();
	setContext('key_mapper', key_mapper);
</script>

<svelte:window onkeydown={key_mapper.handle_keydown.bind(key_mapper)} />

<!--
  You might want to mount a fixed toolbar <Toolbar> here. See:
  https://github.com/michael/svedit/blob/main/src/routes/components/Toolbar.svelte

  Or if you prefer floating tools, hack $lib/Overlays.svelte.
-->
<Svedit {session} editable={true} path={[session.doc.document_id]} />
