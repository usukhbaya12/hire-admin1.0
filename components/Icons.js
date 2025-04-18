export const DropdownIcon = (props) => (
  <svg
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    style={{
      transform: `rotate(${props.rotate}deg)`,
      transition: "transform 0.3s ease",
    }}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
        fill={props.color ? props.color : "currentColor"}
        stroke={props.color ? props.color : "currentColor"}
        strokeWidth="0.5"
      ></path>
    </g>
  </svg>
);

export const MenuIcon = (props) => (
  <svg
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M7 5C7 6.10457 6.10457 7 5 7C3.89543 7 3 6.10457 3 5C3 3.89543 3.89543 3 5 3C6.10457 3 7 3.89543 7 5Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M19 7C20.1046 7 21 6.10457 21 5C21 3.89543 20.1046 3 19 3C17.8954 3 17 3.89543 17 5C17 6.10457 17.8954 7 19 7Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M5 21C6.10457 21 7 20.1046 7 19C7 17.8954 6.10457 17 5 17C3.89543 17 3 17.8954 3 19C3 20.1046 3.89543 21 5 21Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M14 19C14 20.1046 13.1046 21 12 21C10.8954 21 10 20.1046 10 19C10 17.8954 10.8954 17 12 17C13.1046 17 14 17.8954 14 19Z"
        fill="#6a6d70"
      ></path>
      <path
        d="M19 21C20.1046 21 21 20.1046 21 19C21 17.8954 20.1046 17 19 17C17.8954 17 17 17.8954 17 19C17 20.1046 17.8954 21 19 21Z"
        fill="#6a6d70"
      ></path>
    </g>
  </svg>
);

export const PlusIcon = (props) => (
  <svg
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M6 12H18M12 6V18"
        stroke={props.color ? props.color : "#fff"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

export const MoreIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    id="three-dots"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <g
        id="_20x20_three-dots--grey"
        data-name="20x20/three-dots--grey"
        transform="translate(24) rotate(90)"
      >
        <rect id="Rectangle" width="24" height="24" fill="none"></rect>
        <circle
          id="Oval"
          cx="1"
          cy="1"
          r="1"
          transform="translate(5 11)"
          stroke="#000000"
          strokeMiterlimit="10"
          strokeWidth="0.5"
        ></circle>
        <circle
          id="Oval-2"
          data-name="Oval"
          cx="1"
          cy="1"
          r="1"
          transform="translate(11 11)"
          stroke="#000000"
          strokeMiterlimit="10"
          strokeWidth="0.5"
        ></circle>
        <circle
          id="Oval-3"
          data-name="Oval"
          cx="1"
          cy="1"
          r="1"
          transform="translate(17 11)"
          stroke="#000000"
          strokeMiterlimit="10"
          strokeWidth="0.5"
        ></circle>
      </g>
    </g>
  </svg>
);

export const QuoteIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        opacity="0.4"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="currentColor"
      ></path>
      <path
        d="M8.19 16.78H9.67999C10.77 16.78 11.62 15.93 11.62 14.84V13.35C11.62 12.26 10.77 11.41 9.67999 11.41H7.77C7.85 9.59997 8.27 9.33 9.48 8.62C9.84 8.41 9.95001 7.95003 9.74001 7.59003C9.60001 7.35003 9.35 7.21997 9.09 7.21997C8.96 7.21997 8.83001 7.25001 8.71001 7.32001C6.92001 8.38001 6.25 9.07002 6.25 12.15V14.82C6.25 15.91 7.12 16.78 8.19 16.78Z"
        fill="currentColor"
      ></path>
      <path
        d="M14.3209 16.78H15.8109C16.9009 16.78 17.7509 15.93 17.7509 14.84V13.35C17.7509 12.26 16.9009 11.41 15.8109 11.41H13.9008C13.9808 9.59997 14.4009 9.33 15.6109 8.62C15.9709 8.41 16.0808 7.95003 15.8708 7.59003C15.7308 7.35003 15.4809 7.21997 15.2209 7.21997C15.0909 7.21997 14.9609 7.25001 14.8409 7.32001C13.0509 8.38001 12.3809 9.07002 12.3809 12.15V14.82C12.3909 15.91 13.2609 16.78 14.3209 16.78Z"
        fill="currentColor"
      ></path>
    </g>
  </svg>
);
