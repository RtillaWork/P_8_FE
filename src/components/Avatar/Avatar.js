// Avatar component with failback or default picture
// TODO: add aria for accessibility
// TODO add better css
// import 'Avatar.css'

import avatarImageFailback from './avatar_failback.png';

export default function Avatar({
  avatarUrl,
  description,
  size,
  ...restOfProps
}) {
  const failbackImagePath = avatarImageFailback;
  const failbackDescriptionText = "User's avatar image description failback ";
  const failbackSize = 'small'; // small, medium, big

  // Cloudflare is glitching, take a break from Robohash
  // TODO self host Robohash
  avatarUrl = avatarUrl && avatarUrl != '' ? avatarUrl : failbackImagePath;
  // avatarUrl = avatarImageFailback;    // Cloudflare is glitching, take a break from Robohash

  description = description ? description : failbackDescriptionText;
  size = size ? size : failbackSize;

  if (size == 'small') {
    return (
      <>
        <img
          width='64'
          height='64'
          // className="image is-64x64"
          src={avatarUrl}
          alt={description}
        />
      </>
    );
  } else if (size == 'medium') {
    return (
      <>
        <img
          width='128'
          height='128'
          // className="image is-128x128"
          src={avatarUrl}
          alt={description}
        />
      </>
    );
  } else if (size == 'big') {
    return (
      <>
        <img
          width='512'
          height='512'
          // className="image is-512x512"
          src={avatarUrl}
          alt={description}
        />
      </>
    );
  } else {
    // defaults to small if value overridden by any other value
    return (
      <>
        <img
          width='64'
          height='64'
          // className="image is-64x64"
          src={avatarUrl}
          alt={description}
        />
      </>
    );
  }

  /****************************** remove <figure> </figure> 

  if (size == "small") {
    return (
      <figure className="image is-64x64">
        <img src={avatarUrl} alt={description} />
      </figure>
    );
  } else if (size == "medium") {
    return (
      <figure className="image is-128x128">
        <img src={avatarUrl} alt={description} />
      </figure>
    );
  } else if (size == "big") {
    return (
      <figure className="image is-512x512">
        <img src={avatarUrl} alt={description} />
      </figure>
    );
  } else {
    // defaults to small if value overridden by any other value
    return (
      <figure className="image is-64x64">
        <img src={avatarUrl} alt={description} />
      </figure>
    );
  }

****************************************************/
}
