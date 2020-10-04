<?php require_once 'functions.php'; ?>
<!doctype html>
<html lang="cs">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<title>Tereza a Jakub Melicharovi</title>
	<link href="https://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.css" rel="stylesheet" />
	<link rel="stylesheet" href="static/gallery.css?v=1.1" />
</head>
<body>
	<?php $images = getGalleryImages('photobooth'); ?>
	<div class="fotorama" data-hash="true" data-keyboard="true" data-nav="thumbs" data-width="100%" data-height="100%">
		<?php foreach ($images['full'] as $key => $image_full): ?>
			<a id="<?=$key?>" href="<?=$image_full?>" data-thumb="<?=$images['thumb'][$key]?>"></a>
		<?php endforeach; ?>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.js"></script>
</body>
</html>
