package com.gui.roomBooking.repository;

import com.gui.roomBooking.domain.Room;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RoomRepository {

    private final ObjectMapper mapper = new ObjectMapper();

    private static final String ROOMS_JSON = """
        [
          {"id":"R001","name":"Boardroom","capacity":12,"floor":"4","hasWhiteboard":true,"hasVideoConf":true},
          {"id":"R002","name":"Focus Pod A","capacity":4,"floor":"4","hasWhiteboard":false,"hasVideoConf":true},
          {"id":"R003","name":"Focus Pod B","capacity":4,"floor":"4","hasWhiteboard":false,"hasVideoConf":true},
          {"id":"R004","name":"Collaboration Hub","capacity":8,"floor":"4","hasWhiteboard":true,"hasVideoConf":true},
          {"id":"R005","name":"Phone Booth 1","capacity":1,"floor":"4","hasWhiteboard":false,"hasVideoConf":false},
          {"id":"R006","name":"Phone Booth 2","capacity":1,"floor":"4","hasWhiteboard":false,"hasVideoConf":false}
        ]
        """;

    public List<Room> findAll() {
        try {
            return mapper.readValue(ROOMS_JSON, new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse room data", e);
        }
    }

    public Optional<Room> findById(String id) {
        return findAll().stream().filter(r -> r.getId().equals(id)).findFirst();
    }
}
