<script lang="ts">
  // For a more comprehensive integration example, see:
  // https://github.com/michael/svedit/blob/main/src/routes/%2Bpage.svelte
  import { Svedit } from 'svedit';
  import Overlays from '$lib/Overlays.svelte';
  import create_demo_doc from './create_demo_doc';

  const doc = create_demo_doc();
</script>

<div class="demo-wrapper">
  <!--
    You might want to mount a fixed toolbar <Toolbar> here. See:
    https://github.com/michael/svedit/blob/main/src/routes/components/Toolbar.svelte

    Or if you prefer floating tools, hack $lib/Overlays.svelte component.
  -->
  <Svedit {doc} editable={true} path={[doc.document_id]} {Overlays} />
</div>
