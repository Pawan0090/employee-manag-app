pipeline {
    agent any
    
    environment {
        DOCKER_USER     = 'dockerpawan09'
        BACKEND_REPO    = 'employee-backend'
        FRONTEND_REPO   = 'employee-frontend'
        GITHUB_USER     = 'Pawan0090' // 👈 Change to your GitHub username if different
        MANIFEST_REPO   = 'employee-manag-app' // 👈 Your exact GitOps manifest repo name
        NEW_TAG         = "v${BUILD_NUMBER}" // e.g., v1, v2, v3 automatically
    }
    
    stages {
        stage('Pulling Latest Code') {
            steps {
                cleanWs() // Cleans the workspace before starting
                checkout scm // Pulls the code that triggered this build
            }
        }

        stage('Build & Push Backend') {
            steps {
                // Securely logs into Docker Hub using the credentials we saved
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER_ID')]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER_ID --password-stdin
                    cd backend
                    # Since your Jenkins EC2 is a t3.medium (AMD64), standard build naturally outputs AMD64!
                    docker build -t ${DOCKER_USER}/${BACKEND_REPO}:${NEW_TAG} .
                    docker push ${DOCKER_USER}/${BACKEND_REPO}:${NEW_TAG}
                    """
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                sh """
                cd frontend
                docker build -t ${DOCKER_USER}/${FRONTEND_REPO}:${NEW_TAG} .
                docker push ${DOCKER_USER}/${FRONTEND_REPO}:${NEW_TAG}
                """
            }
        }

        stage('Update GitOps Manifests') {
            steps {
                // Authenticates with GitHub using our stored secret token
                withCredentials([string(credentialsId: 'github-token', variable: 'GH_TOKEN')]) {
                    sh """
                    # 1. Clone your configuration deployment repository
                    git clone https://${GH_TOKEN}@github.com/${GITHUB_USER}/${MANIFEST_REPO}.git
                    cd ${MANIFEST_REPO}
                    
                    # 2. Use 'sed' to dynamically find 'tag: ".*"' and replace it with 'tag: "v${BUILD_NUMBER}"'
                    sed -i 's/tag: .*/tag: "${NEW_TAG}"/g' values.yaml
                    
                    # 3. Configure a temporary Git identity for this automated commit
                    git config user.name "Jenkins CI-CD Bot"
                    git config user.email "jenkins-bot@ci-cd.com"
                    
                    # 4. Stage, commit, and push the updated values.yaml back to GitHub
                    git add values.yaml
                    git commit -m "chore: automated tag update to ${NEW_TAG} [skip ci]"
                    git push origin HEAD
                    """
                }
            }
        }
    }
}
