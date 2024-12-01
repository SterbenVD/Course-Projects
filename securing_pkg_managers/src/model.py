from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pandas as pd
import sqlite3
import numpy as np
from utils import connect_db
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, Flatten, Dense, Dropout
from tensorflow.keras.utils import to_categorical
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

'''
TABLE packages:
id INTEGER PRIMARY KEY, name TEXT, maintainer TEXT, version TEXT, first_uploaded TEXT, was_suspicious_before INTEGER

TABLE package_info
id INTEGER PRIMARY KEY, package_id INTEGER, num_files INTEGER, total_additions INTEGER, total_deletions INTEGER, links INTEGER, avg_dir_depth REAL, max_dir_depth INTEGER, avg_file_size REAL, median_file_size REAL, total_size INTEGER, has_executables INTEGER, commit_hash TEXT, time_since_last_commit INTEGER, upload_time TEXT, dependency_count INTEGER
'''

train_db = 'package_analysis.db'

def import_data():
    conn, c = connect_db(train_db)
    df_packages = pd.read_sql_query("SELECT * FROM packages", conn)
    df_package_info = pd.read_sql_query("SELECT * FROM package_info", conn)
    conn.close()
    return df_packages, df_package_info

# Prepare CNN data function
def prepare_cnn_data(data):
    grouped = data.groupby('package_id')
    X = []
    y = []
    
    for package_id, group in grouped:
        # Extract features and label
        features = group.drop(columns=['package_id', 'was_suspicious_before']).values
        print(features)
        label = group['was_suspicious_before'].iloc[0]  # Same label for all rows in a package
        
        X.append(features)
        y.append(label)
    
    # Find the maximum length of sequences (longest package_id group)
    max_timesteps = max(seq.shape[0] for seq in X)
    num_features = X[0].shape[1]  # Number of features (columns)
    
    # Pad sequences to ensure equal length
    X_padded = np.array([
        np.pad(seq, ((0, max_timesteps - seq.shape[0]), (0, 0)), mode='constant')
        for seq in X
    ])
    
    return np.array(X_padded), np.array(y)

def train_model(data):
    # Assuming 'data' is your DataFrame
    X, y = prepare_cnn_data(data)

    # Normalize the features
    scaler = StandardScaler()
    X_normalized = scaler.fit_transform(X.reshape(-1, X.shape[-1])).reshape(X.shape)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_normalized, 
        y, 
        test_size=0.2, 
        random_state=42, 
        stratify=y
    )

    # One-hot encode the labels (for binary classification, this converts 0/1 to [1, 0] and [0, 1])
    y_train = to_categorical(y_train, num_classes=2)
    y_test = to_categorical(y_test, num_classes=2)

    # Define the CNN model using Conv1D
    model = Sequential([
        # First Conv1D layer
        Conv1D(32, kernel_size=3, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2])),
        MaxPooling1D(pool_size=2),  # Reduce dimensions
        Dropout(0.3),              # Dropout to prevent overfitting

        # Second Conv1D layer
        Conv1D(64, kernel_size=3, activation='relu'),
        MaxPooling1D(pool_size=2),
        Dropout(0.3),

        # Flatten and dense layers for classification
        Flatten(),
        Dense(128, activation='relu'),  # Fully connected layer
        Dropout(0.5),
        Dense(2, activation='softmax')  # Output layer for binary classification
    ])

    # Compile the model
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # Print model summary
    model.summary()

    # Train the model
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=20,
        batch_size=32
    )

    # Evaluate the model on the test set
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"Test Loss: {test_loss:.4f}, Test Accuracy: {test_accuracy:.4f}")

    # Predict on the test set
    predictions = model.predict(X_test)
    predicted_classes = np.argmax(predictions, axis=1)

    # Output predictions
    print("Predicted classes:", predicted_classes)

def evaluate_model(model, X_test, y_test):
    confusion_matrix(y_test, model.predict(X_test))
    print(confusion_matrix)

def main():
    df_packages, df_package_info = import_data()
    X_train, X_test, y_train, y_test = split_data(df_packages, df_package_info)
    # model = train_model(X_train, y_train)
    # accuracy = evaluate_model(model, X_test, y_test)
    # print(f'Accuracy: {accuracy}')
    
if __name__ == '__main__':
    main()