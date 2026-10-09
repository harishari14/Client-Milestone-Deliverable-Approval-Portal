package com.prooflane.repository;

import com.prooflane.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {

    List<ActivityLog> findByProjectIdOrderByTimestampDesc(String projectId);

    List<ActivityLog> findAllByOrderByTimestampDesc();
}
