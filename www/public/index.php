<?php require_once 'functions.php'; ?>
<!doctype html>
<html lang="cs">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<title>Tereza a Jakub Melicharovi</title>
	<link rel="stylesheet" href="static/main.css?v=1.1" />
</head>
<body>
	<div class="layout">
		<div class="pattern pattern--left"></div>
		<div class="container">
			<div class="section welcome">
				<h1>NÁŠ SVATEBNÍ DEN</h1>
				<h2 class="h1">Tereza a Jakub Melicharovi</h2>
				<img src="assets/header-text.svg" class="welcome__handwrite" />
				<h2>a takhle se to vydařilo</h2>
				<img src="assets/kittens-front.svg" class="welcome__image" />
			</div>

			<div class="section gallery" data-gallery="wedding">
				<?php $weddingThumbs = getGalleryImages('wedding')['thumb']; ?>
				<?php foreach (getRandomItems($weddingThumbs, 42) as $key => $image): ?>
					<a href="/svatba#<?=$key?>" class="gallery__item">
						<div class="gallery__image" data-lazy="<?=$image?>"></div>
					</a>
				<?php endforeach; ?>
				<div class="gallery__bottom">
					<a href="/svatba" class="button">Zobrazit celou galerii</a>
				</div>
			</div>

			<div class="separator"></div>

			<div class="section gallery" data-gallery="photobooth">
				<h2>Fotokoutek</h2>
				<?php $photoboothThumbs = getGalleryImages('photobooth')['thumb']; ?>
				<?php foreach (getRandomItems($photoboothThumbs, 42) as $key => $image): ?>
					<a href="/fotokoutek#<?=$key?>" class="gallery__item">
						<div class="gallery__image" data-lazy="<?=$image?>"></div>
					</a>
				<?php endforeach; ?>
				<div class="gallery__bottom">
					<a href="/svatba" class="button">Zobrazit celou galerii</a>
				</div>
			</div>

			<div class="separator"></div>

			<div class="section questions">
				<img src="assets/footer-text.svg" class="questions__handwrite" />
				<br />
				<img src="assets/kittens-back.svg" class="questions__image" />
			</div>
		</div>
		<div class="pattern pattern--right"></div>
	</div>

	<script src="https://cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.1.2/dist/lazyload.min.js"></script>
	<script src="static/main.js?v=1.1"></script>
</body>
</html>
