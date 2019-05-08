# one-pagify
Make your well-formed static website automatically do partial page loading

## How to Use

Include the following code in your header.

```
<script type="text/javascript" src="js/one-pagify.js"></script>
```

Then call the following line of code in your javascript somewhere
after the page loads.

```
onePagify.init('main');
```

If you're using VanillaJS then use this code somewhere.

```
document.addEventListener("DOMContentLoaded", function() {
   onePagify.init('main');
});
```

