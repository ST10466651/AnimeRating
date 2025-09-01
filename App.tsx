import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Anime type
type Anime = {
  name: string;
  rating: number;
};

const Home: React.FC<{
  addAnime: (anime: Anime) => void;
  goToRatings: () => void;
}> = ({ addAnime, goToRatings }) => {
  const [animeName, setAnimeName] = useState("");
  const [rating, setRating] = useState<number>(1);

  const handleAddAnime = () => {
    if (animeName.trim() === "") return;
    addAnime({ name: animeName, rating });
    setAnimeName("");
    setRating(1);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>🎬 Anime Rater</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Enter Anime Name"
            placeholderTextColor="#aaa"
            value={animeName}
            onChangeText={setAnimeName}
          />
          <View style={styles.ratingRow}>
            <View style={styles.ratingPickerContainer}>
              <View style={styles.ratingPickerRow}>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.ratingButton,
                      rating === num && styles.ratingButtonSelected,
                    ]}
                    onPress={() => setRating(num)}
                  >
                    <Text
                      style={[
                        styles.ratingButtonText,
                        rating === num && styles.ratingButtonTextSelected,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.ratingPickerRow}>
                {Array.from({ length: 5 }, (_, i) => i + 6).map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.ratingButton,
                      rating === num && styles.ratingButtonSelected,
                    ]}
                    onPress={() => setRating(num)}
                  >
                    <Text
                      style={[
                        styles.ratingButtonText,
                        rating === num && styles.ratingButtonTextSelected,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddAnime}>
            <Text style={styles.addButtonText}>Add Anime!</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={goToRatings} style={styles.linkButton}>
          <Text style={styles.linkText}>View Ratings →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const Ratings: React.FC<{
  anime: Anime[];
  goBack: () => void;
}> = ({ anime, goBack }) => (
  <SafeAreaView style={styles.flex}>
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Anime Ratings</Text>
      {anime.length === 0 ? (
        <Text style={styles.noMovies}>No anime rated yet.</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={anime}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              <Text style={styles.movieName}>{item.name}</Text>
              <Text style={styles.movieRating}>{item.rating}/10</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const App: React.FC = () => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [screen, setScreen] = useState<"home" | "ratings">("home");

  const addAnime = (animeItem: Anime) => setAnime((prev) => [...prev, animeItem]);

  return screen === "home" ? (
    <Home addAnime={addAnime} goToRatings={() => setScreen("ratings")} />
  ) : (
    <Ratings anime={anime} goBack={() => setScreen("home")} />
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  card: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center", // Center the ratings section horizontally
  },
  ratingPickerContainer: {
    alignItems: "center", // Center the rows vertically within the container
    flex: 1,
  },
  ratingPickerRow: {
    flexDirection: "row",
    justifyContent: "center", // Center the buttons in each row
    marginBottom: 4,
  },
  ratingButton: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 4,
  },
  ratingButtonSelected: {
    backgroundColor: "#fb923c",
  },
  ratingButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  ratingButtonTextSelected: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#fb923c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  linkButton: {
    marginTop: 16,
  },
  linkText: {
    color: "#fb923c",
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  list: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 16,
  },
  movieItem: {
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  movieName: {
    color: "#fff",
    fontSize: 16,
  },
  movieRating: {
    color: "#fb923c",
    fontWeight: "bold",
    fontSize: 16,
  },
  noMovies: {
    color: "#ccc",
    fontSize: 18,
    marginVertical: 24,
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#374151",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;
