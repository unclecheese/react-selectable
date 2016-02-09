import React from 'react';

const Album = ({
	selected,
	title,
	year
}) => {
	const classes = selected ? 'item selected' : 'item';
	return (
		<div className={classes}>
			<h2>{title}</h2>
			<small>{year}</small>
		</div>
	)
};

export default Album;
