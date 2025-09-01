import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

// Category type
type Category = "Anime" | "Movie" | "Show";

// Entry type
type Entry = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  category: Category;
};

const categories: Category[] = ["Anime", "Movie", "Show"];

const renderNumbers = (selectedRating: number, setRatingFn?: (r: number) => void) => (
  <View style={styles.numberRow}>
    {Array.from({ length: 10 }, (_, i) => {
      const num = i + 1;
      const isSelected = num === selectedRating;
      return (
        <TouchableOpacity
          key={num}
          disabled={!setRatingFn}
          onPress={() => setRatingFn && setRatingFn(num)}
          style={[
            styles.numberButton,
            isSelected && styles.numberButtonSelected,
          ]}
        >
          <Text style={[
            styles.numberText,
            isSelected && styles.numberTextSelected,
          ]}>
            {num}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const Home: React.FC<{
  addEntry: (entry: Entry) => void;
  goToRatings: () => void;
  existingEntries: Entry[];
}> = ({ addEntry, goToRatings, existingEntries }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState<Category>("Anime");

  // Refs for TextInputs
  const nameInputRef = useRef<TextInput>(null);
  const commentInputRef = useRef<TextInput>(null);

  const handleAddEntry = () => {
    if (!name.trim() || rating === 0) return;

    // Duplicate check (case-insensitive, same category)
    const duplicate = existingEntries.some(
      (a) =>
        a.name.toLowerCase() === name.trim().toLowerCase() &&
        a.category === category
    );
    if (duplicate) {
      Alert.alert("Duplicate Entry", `This ${category.toLowerCase()} has already been rated.`);
      return;
    }

    if (comment.length > 100) {
      Alert.alert("Too Long", "Comment must be 100 characters or less.");
      return;
    }

    addEntry({
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      comment,
      category,
    });
    setName("");
    setRating(0);
    setComment("");
    // Dismiss keyboard and blur inputs
    nameInputRef.current?.blur();
    commentInputRef.current?.blur();
    Keyboard.dismiss();
  };

  // Dismiss keyboard and blur inputs on screen touch
  const handleScreenTouch = () => {
    nameInputRef.current?.blur();
    commentInputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch} accessible={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>🎬 CineRate Pro</Text>
          <View style={styles.card}>
            {/* Category Picker */}
            <View style={styles.categoryRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonSelected,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    handleScreenTouch();
                  }}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              ref={nameInputRef}
              placeholder={`Enter ${category} name...`}
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleScreenTouch}
            />

            <Text style={styles.label}>Select Rating</Text>
            {renderNumbers(rating, (r) => {
              setRating(r);
              handleScreenTouch();
            })}

            <Text style={styles.label}>Your Thoughts</Text>
            <View style={styles.commentBox}>
              <TextInput
                ref={commentInputRef}
                style={styles.commentInput}
                placeholder="Write a short review..."
                placeholderTextColor="#aaa"
                value={comment}
                onChangeText={(text) =>
                  text.length <= 100 ? setComment(text) : null
                }
                multiline
                scrollEnabled
                textAlignVertical="top"
                returnKeyType="done"
                onSubmitEditing={handleScreenTouch}
              />
            </View>
            <Text style={styles.charCount}>{comment.length}/100</Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
              <Text style={styles.addButtonText}>+ Add {category}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => { goToRatings(); handleScreenTouch(); }} style={styles.linkButton}>
            <Text style={styles.linkText}>View Ratings →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const Ratings: React.FC<{
  entries: Entry[];
  goBack: () => void;
}> = ({ entries, goBack }) => {
  // Split by category
  const anime = entries.filter((e) => e.category === "Anime");
  const movies = entries.filter((e) => e.category === "Movie");
  const shows = entries.filter((e) => e.category === "Show");

  const renderSection = (title: string, data: Entry[]) => {
    if (data.length === 0) {
      return (
        <View style={{ marginBottom: 24, width: "100%", maxWidth: 420 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.noMovies}>No {title.toLowerCase()} rated yet.</Text>
        </View>
      );
    }

    // If 3 or more, use FlatList (scrollable), else map directly (not scrollable)
    if (data.length >= 3) {
      return (
        <View style={{ marginBottom: 24, width: "100%", maxWidth: 420, height: 180 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <FlatList
            style={styles.list}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.movieName}>{item.name}</Text>
                  <Text style={styles.commentText}>
                    {item.comment ? item.comment : "No comment"}
                  </Text>
                </View>
                <Text style={styles.movieRatingText}>{item.rating} / 10</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    } else {
      return (
        <View style={{ marginBottom: 24, width: "100%", maxWidth: 420 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {data.map((item) => (
            <View style={styles.movieCard} key={item.id}>
              <View style={{ flex: 1 }}>
                <Text style={styles.movieName}>{item.name}</Text>
                <Text style={styles.commentText}>
                  {item.comment ? item.comment : "No comment"}
                </Text>
              </View>
              <Text style={styles.movieRatingText}>{item.rating} / 10</Text>
            </View>
          ))}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Ratings</Text>
      <View style={{ width: "100%", alignItems: "center" }}>
        {renderSection("Anime", anime)}
        {renderSection("Movie", movies)}
        {renderSection("Show", shows)}
      </View>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [screen, setScreen] = useState<"home" | "ratings">("home");

  const addEntry = (entry: Entry) => setEntries((prev) => [...prev, entry]);

  return screen === "home" ? (
    <Home
      addEntry={addEntry}
      goToRatings={() => setScreen("ratings")}
      existingEntries={entries}
    />
  ) : (
    <Ratings entries={entries} goBack={() => setScreen("home")} />
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#06205cff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginVertical: 28,
    color: "#f97316",
    letterSpacing: 0.8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1a4ea3ff",
    borderRadius: 18,
    padding: 20,
    width: "100%",
    maxWidth: 420,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 14,
  },
  categoryButton: {
    backgroundColor: "#fff",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  categoryButtonSelected: {
    backgroundColor: "#f97316",
  },
  categoryButtonText: {
    color: "#0f172a",
    fontWeight: "500",
    fontSize: 15,
  },
  categoryButtonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    textAlign: "center",
  },
  label: {
    color: "#e2e8f0",
    fontSize: 15,
    marginBottom: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  numberRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
    justifyContent: "center",
  },
  numberButton: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  numberButtonSelected: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  numberText: {
    color: "#0f172a",
    fontWeight: "500",
    fontSize: 16,
  },
  numberTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  commentBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    height: 100,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },
  charCount: {
    color: "#94a3b8",
    fontSize: 12,
    alignSelf: "flex-end",
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: "#f97316",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  linkButton: {
    marginTop: 14,
    alignSelf: "center",
  },
  linkText: {
    color: "#f97316",
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "500",
    textAlign: "center",
  },
  sectionTitle: {
    color: "#facc15",
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 6,
    alignSelf: "center",
    textAlign: "center",
  },
  list: {
    width: "100%",
    maxWidth: 420,
    marginBottom: 14,
    alignSelf: "center",
  },
  movieCard: {
    backgroundColor: "#275fadff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  movieName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  movieRating: {
    flexDirection: "row",
    justifyContent: "center",
  },
  movieRatingText: {
    color: "#facc15",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    textAlign: "center",
  },
  noMovies: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  backButton: {
    marginTop: 14,
    backgroundColor: "#234b8aff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: "center",
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
  commentText: {
    color: "#e2e8f0",
    fontSize: 13,
    marginTop: 4,
    fontStyle: "italic",
    textAlign: "left",
  },
});

export default App;
