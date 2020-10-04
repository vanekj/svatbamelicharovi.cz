<?php

/**
 * Get gallery images paths
 *
 * @param string $gallery Which folder will be used
 * @return array Associative array of gallery images
 */
function getGalleryImages(string $gallery, array $sizes = ['full', 'thumb']): array {
	return array_reduce($sizes, function($images, $size) use ($gallery) {
		$gallery_path = "gallery/$size/$gallery";
		$images_paths = array_diff(scandir($gallery_path), ['..', '.']);
		$images[$size] = array_reduce($images_paths, function($files, $file) use ($gallery_path) {
			$files[$file] = "$gallery_path/$file";
			return $files;
		}, []);
		return $images;
	}, []);
}

/**
 * Get random N items from an array
 *
 * @param array $array From where the items will be taken
 * @param integer $count How many items should be returned
 * @return array Random items from the given array
 */
function getRandomItems(array $array, int $count): array {
	$keys = array_keys($array);
	shuffle($keys);
	foreach($keys as $key) {
		$shuffled_array[$key] = $array[$key];
	}
	return array_slice($shuffled_array, 0, $count);
}
