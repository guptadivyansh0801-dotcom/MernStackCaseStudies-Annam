// Code Walkthrough - User type with nullable and optional
type User = {
    name: string;
    age: number | null;
    email?: string;
};

let user1: User = {
    name: "John Doe",
    age: null,
    email: "john@example.com"
};

let user2: User = {
    name: "Jane Doe",
    age: 25
};

// Code Walkthrough - Checking and handling values
function printUser(user: User): void {
    let ageInfo = user.age === null ? "Age not provided" : `Age: ${user.age}`;
    let emailInfo = user.email ? `Email: ${user.email}` : "Email not set";
    console.log(`${user.name} - ${ageInfo}, ${emailInfo}`);
}

printUser(user1);
printUser(user2);

// Challenge 1: Define type Profile
type Profile = {
    username: string;
    bio: string | null;
    avatarUrl?: string;
};

// Challenge 2: Create two profiles
let profile1: Profile = {
    username: "[YOUR_USERNAME]",
    bio: null
};

let profile2: Profile = {
    username: "jane_doe",
    bio: "Developer and coffee lover",
    avatarUrl: "https://example.com/avatar.jpg"
};

// Challenge 3: showProfile function
function showProfile(profile: Profile): void {
    let bioText = profile.bio === null ? "No bio available" : profile.bio;
    let avatarText = profile.avatarUrl ?? "default-avatar.png";
    console.log(`Username: ${profile.username}`);
    console.log(`Bio: ${bioText}`);
    console.log(`Avatar: ${avatarText}`);
}

showProfile(profile1);
showProfile(profile2);
